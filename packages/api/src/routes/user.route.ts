export const user = (app, _, done) => {
  app.addHook("onRequest", (request) => request.jwtVerify());


  done();
};