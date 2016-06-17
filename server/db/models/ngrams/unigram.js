'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {
  db.define('word', {
    word: {
      type: Sequelize.STRING,
      unique: true
    },
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      incrementWord: function(word){
        return this.findOrCreate({where: {word}}).then( word => {
          return word[0].increment('frequency');
        })
      }
    }
  })
}
