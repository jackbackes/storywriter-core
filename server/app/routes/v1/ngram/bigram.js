'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
const path = require('path');
const db = require(path.join(__base, 'db'))
const Bigram = db.models['bigram'];
const Bluebird = require('bluebird');


router.get('/', (req, res, next) => {

  Bigram.mostLikely()
    .then( wordArray => res.status(200).send(wordArray) )
    .catch(next);

})

router.get('/:tokenOne', (req, res, next) => {

    let tokenOne = req.params.tokenOne;
    Bigram.mostLikely(tokenOne)
      .then( wordArray => res.status(200).send(wordArray) )
      .catch(next);

})
