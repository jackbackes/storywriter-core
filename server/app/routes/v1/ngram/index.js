'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

router.use('/unigram', require('./unigram'))
router.use('/bigram', require('./bigram'))

router.get('/', (req, res, next)=>{
  res.send('ngram says, happy day!')
})
