'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/v1', require('./v1'));

router.get('/', (req, res, next)=>{
  res.send('api says, happy day!')
})

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
