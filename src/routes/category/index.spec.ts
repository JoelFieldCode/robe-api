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
});
