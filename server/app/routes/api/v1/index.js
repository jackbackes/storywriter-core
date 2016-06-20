'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

router.use('/ngram', require('./ngram'))

router.get('/', (req, res, next)=>{
  res.send('v1 says, happy day!')
})
