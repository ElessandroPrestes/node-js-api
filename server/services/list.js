const Validation = require('../errors/Validation');

module.exports = (app) => {
  const save = async (list) => {
    if (!list.name)
      throw new Validation('List name is a required attribute');

    return app.db('lists').insert(list, '*');
  };

  const findAll = () => {
    return app.db('lists');
  };

  const findId = (filter = {}) => {
    return app.db('lists').where(filter).first();
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

  return { save, findAll, findId, update, remove };


};