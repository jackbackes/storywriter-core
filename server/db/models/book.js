'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {
  db.define('book', {
    title: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING
    }
  }, {
    instanceMethods: {
      addUnigrams: addUnigrams
    }
  })
}


function addUnigrams(){};
