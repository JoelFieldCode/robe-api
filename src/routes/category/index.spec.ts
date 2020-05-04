import app from "../../";
import supertest from "supertest";
import sharedPool from "../../database/pool";

describe("Categories", () => {
  it("should retrieve categories", (done) => {
    const server = supertest(app);
    // todo make this re-usable between tests
    server
      .post("/auth/login")
      .set("google-access-token", "test")
      .send()
      .end((err, res) => {
        server
          .get("/category")
          .set("Authorization", `Bearer ${res.body.token}`)
          .end((err, res) => {
            const categories = res.body;
            expect(categories.length).toBe(5);
            expect(categories[2].name).toBe("Bottoms");
            sharedPool.end();
            done();
          });
      });
  });
});
