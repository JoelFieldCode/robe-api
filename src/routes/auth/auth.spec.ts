import { ALLOWED_DEV_TOKEN } from "../../services/auth/login";
import supertest from "supertest";
import app, { server } from "../../";
import nock from "nock";

describe("Auth", () => {
  const google_access_token = "proper-token";
  it("requires a google access token", (done) => {
    supertest(app)
      .post("/auth/login")
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(401);
        server.close();
        done();
      });
  });

  it("allows test token in dev", (done) => {
    supertest(app)
      .post("/auth/login")
      .set("google-access-token", ALLOWED_DEV_TOKEN)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });

  it("catches google auth error", (done) => {
    nock(`https://www.googleapis.com`)
      .get(`/oauth2/v1/tokeninfo?access_token=${google_access_token}`)
      .reply(403);
    supertest(app)
      .post("/auth/login")
      .set("google-access-token", google_access_token)
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(401);
        server.close();
        done();
      });
  });

  it("only authorises valid client id", (done) => {
    nock(`https://www.googleapis.com`)
      .get(`/oauth2/v1/tokeninfo?access_token=${google_access_token}`)
      .reply(200, { issued_to: "test" });
    supertest(app)
      .post("/auth/login")
      .set("google-access-token", "proper-token")
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(401);
        server.close();
        done();
      });
  });

  it("authenticates", (done) => {
    nock(`https://www.googleapis.com`)
      .get(`/oauth2/v1/tokeninfo?access_token=${google_access_token}`)
      .reply(200, { issued_to: process.env.GOOGLE_CLIENT_ID });
    supertest(app)
      .post("/auth/login")
      .set("google-access-token", "proper-token")
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(200);
        server.close();
        done();
      });
  });

  it("catches error", (done) => {
    nock(`https://www.googleapis.com`)
      .get(`/oauth2/v1/tokeninfo?access_token=${google_access_token}`)
      .replyWithError("Error");
    supertest(app)
      .post("/auth/login")
      .set("google-access-token", "proper-token")
      .end((err, res) => {
        expect(err).toBeFalsy();
        expect(res.status).toBe(401);
        server.close();
        done();
      });
  });
});
