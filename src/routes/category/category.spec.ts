import jwt from "jsonwebtoken";
import Category from "../../models/Category";
import Item from "../../models/Item";
import supertest from "supertest";
import app, { server } from "../..";
import sharedPool from "../../database/pool";
import { mockVerifyWithUserId } from "../../test-utils/jwt.mock";
import { ALLOWED_DEV_TOKEN } from "../../services/auth/login";

describe("Categories", () => {
  let category_id = 0;
  let item_id = 0;
  let category_without_items_id = 0;
  beforeAll((done) => {
    jest
      .spyOn(jwt, "verify")
      .mockImplementation(mockVerifyWithUserId(ALLOWED_DEV_TOKEN));
    supertest(app)
      .post("/category")
      .send({ name: "no items", image_url: "https://www.google.com" })
      .end((err, res) => {
        category_without_items_id = res.body.id;
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
      .send({ name: "has items", image_url: "https://www.google.com" })
      .end((err, res) => {
        const category = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(201);
        expect(category.name).toBe("has items");
        category_id = category.id;
        server.close();
        done();
      });
  });

  it("should restrict direct access to a category", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .get(`/category/${category_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });

  it("should restrict direct access to a categorys items", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .get(`/category/${category_id}/items`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });

  it("should not return other user's categories", (done) => {
    jest
      .spyOn(jwt, "verify")
      .mockReset()
      .mockImplementationOnce(mockVerifyWithUserId("test2"));
    supertest(app)
      .get(`/category`)
      .end((err, res) => {
        const categories: Category[] = res.body;
        const foundCategory = categories.find((c) => c.id === category_id);
        expect(foundCategory).not.toBeTruthy();
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });

  it("should get a category", (done) => {
    supertest(app)
      .get(`/category/${category_id}`)
      .end((err, res) => {
        const category: Category = res.body;
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        expect(category.id).toBe(category_id);
        expect(category.name).toBe("has items");
        server.close();
        done();
      });
  });

  it("should return the users categories", (done) => {
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

  it("should retreive categories with and without child items", (done) => {
    supertest(app)
      .get(`/category`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        const categories: Category[] = res.body;
        const foundCategoryWithItems = categories.find(
          (c) => c.id === category_id
        );
        expect(foundCategoryWithItems).toBeTruthy();
        expect(foundCategoryWithItems.item_count).toBe(1);
        const foundCategoryWithoutItems = categories.find(
          (c) => c.id === category_without_items_id
        );
        expect(foundCategoryWithoutItems).toBeTruthy();
        expect(foundCategoryWithoutItems.item_count).toBe(0);
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

  it("should not find the category as it is deleted", (done) => {
    supertest(app)
      .get(`/category/${category_id}`)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(403);
        server.close();
        done();
      });
  });
});
