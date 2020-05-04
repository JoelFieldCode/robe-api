import app from "../../";
import supertest from "supertest";
import sharedPool from "../../database/pool";
import { ALLOWED_DEV_TOKEN } from "../../services/auth/login";

describe("Categories", () => {
  it("should retrieve categories", (done) => {
    const server = supertest(app);
    server
      .get("/category")
      .set("Authorization", `Bearer ${ALLOWED_DEV_TOKEN}`)
      .end((err, res) => {
        const categories = res.body;
        expect(categories.length).toBe(5);
        expect(categories[2].name).toBe("Bottoms");
        sharedPool.end();
        done();
      });
  });
});
