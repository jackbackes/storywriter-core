'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
const Bluebird = require('bluebird');
const path = require('path');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
        // next();
    }
};

router.get('/stories', ensureAuthenticated, function(req, res, next){
  const db = require(path.join(__base, 'db'));
  const User = db.models['user'];
  User.findById(req.user.id)
      .then( user => user.get('stories'))
      .then( result => res.status(200).send(result))
      .catch(next);
})

router.post('/story', ensureAuthenticated, function(req, res, next){
  // req.user.addStory(req.body)
  //    .then( result => res.status(201).send(result) )
  //    .catch(next)
  let result = req.user.addStory(req.body)
  res.status(201).send(result)
})

router.get('/secret-stash', ensureAuthenticated, function (req, res) {

    var theStash = [
        'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
        'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
        'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
        'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
        'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
        'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
        'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
        'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
        'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
        'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
        'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    ];

    res.send(_.shuffle(theStash));

});
