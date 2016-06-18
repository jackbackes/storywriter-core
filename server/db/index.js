'use strict';
var db = require('./_db');
module.exports = db;

/** @category model */
require('./models/user')(db);
require('./models/book')(db);
require('./models/ngrams/unigram')(db);
require('./models/ngrams/bigram')(db);
