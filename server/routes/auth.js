const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const Validation = require('../errors/Validation');

const secret = 'Secret';

module.exports = (app) => {
  const signin = (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new Validation('Invalid username or password');
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new Validation('Invalid username or password');
      }).catch(err => next(err));
  };

  return { signin };
}