'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {
  db.define('word', {
    word: {
      type: Sequelize.STRING,
    },
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  })
}
