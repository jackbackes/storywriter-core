'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

router.use('./v1', require('./v1'))

router.get('/', (req, res, next)=>{
  res.send('api says, happy day!')
})
