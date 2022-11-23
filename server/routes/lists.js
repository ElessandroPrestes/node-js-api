const express = require('express');
const ResourceImproperError = require('../errors/ResourceImproperError');


module.exports = (app) => {
  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.list.findOne({ id: req.params.id })
      .then((lis) => {
        if (lis.user_id !== req.user.id) throw new ResourceImproperError();
        else next();
      }).catch(err => next(err));
  });

  router.post('/', (req, res, next) => {
    app.services.list.create({ ...req.body, user_id: req.user.id })
      .then((resul) => {
        return res.status(201).json(resul[0]);
      }).catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.list.findId(req.user.id)
      .then(resul => res.status(200).json(resul))
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.list.findOne({ id: req.params.id })
      .then(resul => res.status(200).json(resul))
      .catch(err => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.list.update(req.params.id, req.body)
      .then(resul => res.status(200).json(resul[0]))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.list.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  });

  return router;
};