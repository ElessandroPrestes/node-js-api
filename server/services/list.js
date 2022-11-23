const ValidationError = require('../errors/Validation');

module.exports = (app) => {
  const create = async (list) => {
    if (!list.name)
      throw new ValidationError('List name is a required attribute');

    const listDb = await findOne({ name: list.name, user_id: list.user_id });
    if (listDb) throw new ValidationError('A list with that name already exists!');

    return app.db('lists').insert(list, '*');
  };

  const findAll = () => {
    return app.db('lists');
  };

  const findOne = (filter = {}) => {
    return app.db('lists').where(filter).first();
  };

  const findId = (userId) => {
    return app.db('lists').where({ user_id: userId });
  };

  const update = (id, list) => {
    return app.db('lists')
      .where({ id })
      .update(list, '*');
  };

  const remove = (id) => {
    return app.db('lists')
      .where({ id })
      .del()
  }

  return { create, findAll, findOne, findId, update, remove };


};