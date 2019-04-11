var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate')
var JSONAPIError = require('jsonapi-serializer').Error;
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var User = require('../models/user');
var uuid = require('uuid/v4');

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
  res.send('respond with a resource');
});

var userSerializer = new JSONAPISerializer('users', {
  attributes: ['email', 'uniqueToken', 'expireToken']
});

router.post('/login', function(req, res, next) {
  if(req.body && req.body.email && req.body.password){
    User.findOne({
      email:req.body.email,
      password:req.body.password
    }, function (err, user) {
      if(user) {
         user.uniqueToken = uuid() + user.email; // just uuid could generate collisions
         var now = Date.now();
         user.expireToken = now.setDate(now.getDate() + 7);
         user.save(function (err) {
          if (err) {
            res.send(JSONAPIError({
              code: 'users:3',
              title: 'Internal server failure',
              detail: 'User token could not be stored.'
            }));
           }
         });
         res.send(userSerializer.serialize(user));
      }
      else {
        res.send(JSONAPIError({
          code: 'users:2',
          title: 'The combination user and password was not found',
          detail: 'You must provide the email and password correctly. Did you forget your password?'
        }));
      }
    });
  }
  else{
    res.send(JSONAPIError({
      code:'users:1',
      title: 'Malformated post data',
      detail: 'You must provide a email and password as json body'
    }));
  }
});

module.exports = router;
