import jwt from "jsonwebtoken";
import Category from "../../models/Category";
import Item from "../../models/Item";
import supertest from "supertest";
import app, { server } from "../../";
import sharedPool from "../../database/pool";
import { mockVerifyWithUserId } from "../../test-utils/jwt.mock";
import { ALLOWED_DEV_TOKEN } from "../../services/auth/login";

describe("Categories", () => {
  beforeEach(() => {
    jest
      .spyOn(jwt, "verify")
      .mockImplementationOnce(mockVerifyWithUserId(ALLOWED_DEV_TOKEN));
  });
  afterAll(() => {
    sharedPool.end();
  });
  let category_id = 0;
  let item_id = 0;

  it("should fail creating a category", (done) => {
    supertest(app)
      .post("/category")
      .send({ image_url: "https://www.google.com" })
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(422);
        server.close();
        done();
      });
  });

  it("should create a category", (done) => {
    supertest(app)
      .post("/category")
      .send({ name: "Dresses", image_url: "https://www.google.com" })
      .end((err, res) => {
        const category = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(201);
        expect(category.name).toBe("Dresses");
        category_id = category.id;
        server.close();
        done();
      });
  });

  it("should get a category", (done) => {
    supertest(app)
      .get(`/category/${category_id}`)
      .end((err, res) => {
        const category = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        expect(category.id).toBe(category_id);
        expect(category.name).toBe("Dresses");
        server.close();
        done();
      });
  });

  it("should get categories", (done) => {
    supertest(app)
      .get(`/category`)
      .end((err, res) => {
        const categories: Category[] = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        expect(
          categories.find((category) => category.id === category_id)
        ).toBeTruthy();
        server.close();
        done();
      });
  });

  it("should create items in a category", (done) => {
    supertest(app)
      .post(`/item`)
      .send({
        category_id: category_id,
        name: "test",
        price: 40,
        url: "https://www.google.com",
        image_url: "https://www.google.com",
      })
      .end((err, res) => {
        const item: Item = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(201);
        item_id = item.id;
        server.close();
        done();
      });
  });

  it("should get items from a category", (done) => {
    supertest(app)
      .get(`/category/${category_id}/items`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        const items: Item[] = res.body;
        expect(items[0].name).toBe("test");
        expect(items[0].id).toBe(item_id);
        server.close();
        done();
      });
  });

  it("should fail deleting a category the user doesnt have access to", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .delete(`/category/${category_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });

  it("should delete a category", (done) => {
    supertest(app)
      .delete(`/category/${category_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });
});
