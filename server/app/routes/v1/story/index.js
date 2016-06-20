'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');


router.get('/', (req, res, next)=>{
  res.send('story says, happy day!')
})
