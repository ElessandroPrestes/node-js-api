module.exports = (app) => {
  const create = (req, res, next) => {
    app.services.list.save(req.body)
      .then((resul) => {
        return res.status(201).json(resul[0]);
      }).catch(err => next(err));
  };

  const findAll = (req, res, next) => {
    app.services.list.findAll()
      .then(resul => res.status(200).json(resul))
      .catch(err => next(err));
  };

  const findId = (req, res, next) => {
    app.services.list.findId({ id: req.params.id })
      .then(resul => res.status(200).json(resul))
      .catch(err => next(err));
  };

  const update = (req, res, next) => {
    app.services.list.update(req.params.id, req.body)
      .then(resul => res.status(200).json(resul[0]))
      .catch(err => next(err));
  };

  const remove = (req, res, next) => {
    app.services.list.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }

  return { create, findAll, findId, update, remove };

};