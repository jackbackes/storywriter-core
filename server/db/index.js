'use strict';
var db = require('./_db');
module.exports = db;

/** @category model */
require('./models/user')(db);
require('./models/book')(db);
require('./models/ngrams/unigram')(db);
require('./models/ngrams/bigram')(db);

// const Word = db.model('word');
const Bigram = db.model('bigram');

Bigram.addAssociations(db);

/*
Trigram.hasOne(Word, {as: 'tokenOne'});
Trigram.hasOne(Word, {as: 'tokenTwo'});
Trigram.hasOne(Word, {as: 'tokenThree'});
 */
