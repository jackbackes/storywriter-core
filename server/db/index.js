'use strict';
var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/book')(db);
require('./models/ngrams/unigram')(db);
