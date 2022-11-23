module.exports = (app) => {
  app.route('/auth/signup')
    .post(app.routes.users.create);
  app.route('/auth/signin')
    .post(app.routes.auth.signin);


  app.route('/api/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app.route('/api/lists')
    //.all(app.config.passport.authenticate())
    .get(app.routes.lists.findAll)
    .post(app.routes.lists.create);

  app.route('/api/lists/:id')
    //.all(app.config.passport.authenticate())
    .get(app.routes.lists.findId)
    .put(app.routes.lists.update)
    .delete(app.routes.lists.remove);
};