module.exports = (app) => {
  app.route('/auth/signin')
    .post(app.routes.auth.signin);
  app.route('/auth/signup')
    .post(app.routes.users.create);

  app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app.route('/lists')
    .all(app.config.passport.authenticate())
    .get(app.routes.lists.findAll)
    .post(app.routes.lists.create);

  app.route('/lists/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.lists.findId)
    .put(app.routes.lists.update)
    .delete(app.routes.lists.remove);
};