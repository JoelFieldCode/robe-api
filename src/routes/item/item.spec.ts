import jwt from "jsonwebtoken";
import supertest from "supertest";
import app, { server } from "../..";
import sharedPool from "../../database/pool";
import { ALLOWED_DEV_TOKEN } from "../../services/auth/login";
import { mockVerifyWithUserId } from "../../test-utils/jwt.mock";

describe("Items", () => {
  let category_id: number = 0;
  let item_id: number = 0;
  beforeAll((done) => {
    jest
      .spyOn(jwt, "verify")
      .mockImplementation(mockVerifyWithUserId(ALLOWED_DEV_TOKEN));
    supertest(app)
      .post("/category")
      .send({ name: "Dresses", image_url: "https://www.google.com" })
      .end((err, res) => {
        category_id = res.body.id;
        expect(err).toBeFalsy();
        expect(res.status).toBe(201);
        server.close();
        done();
      });
  });
  beforeEach(() => {
    jest
      .spyOn(jwt, "verify")
      .mockImplementationOnce(mockVerifyWithUserId(ALLOWED_DEV_TOKEN));
  });
  afterAll(() => {
    sharedPool.end();
  });

  it("should validate creating a item", (done) => {
    supertest(app)
      .post("/item")
      .send({ image_url: "https://www.google.com" })
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(422);
        server.close();
        done();
      });
  });

  it("should not allow creating an item in a category not belonging to the user", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .post("/item")
      .send({
        category_id,
        name: "test",
        price: 40,
        url: "https://www.google.com",
        image_url: "https://www.google.com",
      })
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });

  it("should succeed creating an item", (done) => {
    supertest(app)
      .post("/item")
      .send({
        category_id,
        name: "test",
        price: 40,
        url: "https://www.google.com",
        image_url: "https://www.google.com",
      })
      .end((err, res) => {
        item_id = res.body.id;
        expect(err).toBeFalsy();
        expect(res.status).toBe(201);
        server.close();
        done();
      });
  });

  it("should handle not finding an item", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .get(`/item/${item_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(404);
        server.close();
        done();
      });
  });

  it("should be able to retrieve the item individually", (done) => {
    supertest(app)
      .get(`/item/${item_id}`)
      .end((err, res) => {
        expect(res.body.id).toBe(item_id);
        expect(res.body.name).toBe("test");
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });

  it("should only allow the user who owns the item to delete it", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .delete(`/item/${item_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });

  it("should allow deleting an item", (done) => {
    supertest(app)
      .delete(`/item/${item_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });

  it("should not find the item as it is deleted", (done) => {
    supertest(app)
      .get(`/item/${item_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(404);
        server.close();
        done();
      });
  });
});
