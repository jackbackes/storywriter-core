'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
const path = require('path');
const db = require(path.join(__base, 'db'))
const Unigram = db.models['word'];


router.get('/', (req, res, next) => {
  Unigram.mostLikely()
         .then( wordArray => res.status(200).send(wordArray) )
         .catch(next);
})
