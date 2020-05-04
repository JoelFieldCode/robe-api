import app from "../../";
import supertest from "supertest";
import sharedPool from "../../database/pool";
import { verify } from "../../test-utils/jwt.mock";
import jwt from "jsonwebtoken";

describe("Categories", () => {
  beforeEach(() => {
    jest.spyOn(jwt, "verify").mockImplementationOnce(verify);
  });
  afterAll(() => {
    sharedPool.end();
  });
  it("should retrieve categories", (done) => {
    const server = supertest(app);
    server.get("/category").end((err, res) => {
      const categories = res.body;
      expect(err).toBeFalsy();
      expect(res.status).toBe(200);
      expect(categories.length).toBe(5);
      expect(categories[2].name).toBe("Bottoms");
      done();
    });
  });

  it("should get a category", (done) => {
    const server = supertest(app);
    server.get("/category/2").end((err, res) => {
      const category = res.body;
      expect(err).toBeFalsy();
      expect(res.status).toBe(200);
      expect(category.id).toBe(2);
      expect(category.name).toBe("Tops");
      done();
    });
  });

  it("should handle not finding a category", (done) => {
    const server = supertest(app);
    server.get("/category/6").end((err, res) => {
      expect(err).toBeFalsy();
      expect(res.status).toBe(404);
      done();
    });
  });
});
