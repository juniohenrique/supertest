describe("Service: /", () => {
  describe("GET /", () => {
    it("deve estar online", done => {
      request.get("/")
        .expect(200)
        .end((err, res) => {
          const expected = {status: "Ninja Task API"};
          expect(res.body).to.eql(expected);
          done(err);
        });
    });
  });
});
