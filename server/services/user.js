const Validation = require('../errors/Validation');
const bcrypt = require('bcrypt-nodejs');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail']);
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const create = async (user) => {
    if (!user.name)
      throw new Validation('Name is required, check!');

    if (!user.mail)
      throw new Validation('Email is required, check!');

    if (!user.password)
      throw new Validation('Password is required, check!');

    const userDb = await findOne({ mail: user.mail });
    if (userDb)
      throw new Validation('E-mail already registered!');

    const newUser = { ...user };
    newUser.password = getPasswordHash(user.password);
    return app.db('users').insert(newUser, ['id', 'name', 'mail']);
  }

  return { findAll, create, findOne };
};