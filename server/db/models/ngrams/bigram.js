'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');
const bluebird = require('bluebird');

/**
 * [defaultRules are the default Normalization Rules used by Word.parseText()]
 * @type {Array.<Array.<RegExp, String>>}
 */
let defaultRules = [
  // [regex, replace value]
  [/\n/g, '<n>'],
  [/[\.\!\,\?]/g, '$&</s><s>']
]
// let phraseParser = /[\w\-]+|[\.\!\,\?]|<n>|<s>|<\/s>/g
let defaultPhraseParser = /[\w\-]+/g

function phraseParser(){
  return defaultPhraseParser;
}

/** @class Bigram */
module.exports = function (db) {
  db.define('bigram', {
    /** @constructs Word */
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    bigramP: {
      type: Sequelize.VIRTUAL,
      get: function() {
        return this.unigramProbability();
      }
    }
  }, {
    /** @lends Word */
    classMethods: {
      // /**
      //  * [incrementWord description]
      //  * @summary adds or increments a word
      //  * @param  {String} word [the word to add]
      //  * @return {Object}      [instance of Word]
      //  */
      // incrementWord(word){
      //   const Word = db.models['word'];
      //   return Word.findCreateFind({where: {word}})
      //              .spread( (word, created) => {
      //                if(!word) throw 'no word'
      //                return [word, created];
      //              })
      //              .spread( (word, created) => {
      //                if(created) return word;
      //                return word.increment('frequency')
      //              })
      //              .catch(err => err);
      // },
      /**
       * [parseText parses raw text into an array]
       * @param  {String} rawText [a string or String.raw template literal, possibly with multiple lines]
       * @param  {Array.<Array.<RegExp, String>>} [normalizationRules = defaultRules]
       * @return {Array.<String>}         [raw]
       */
      parseText: function(){
        const Word = db.models['word'];
        let bigramArray = []
        return Word.phraseParser(...arguments).then( wordArray =>
          wordArray.map( function(value, index, array) {
            if(!array[index+1]) bigramArray.push( [value, `</s>`])
            else bigramArray.push( [value, array[index+1]] )
          }));
      },
      /**
       * [addPhrase]
       * @param  {String} rawText [a string or String.raw template literal, possibly with multiple lines]
       * @param  {Array.<Array.<RegExp, String>>} [normalizationRules = defaultRules]
       * @see addWordWithFrequency
       * @returns {Promise.<Array.Object>} addedWords
      */
      addPhrase: function(rawText, normalizationRules = defaultRules){
        const Word = db.models['word'];
        let phraseArray = Word.parseText(rawText, normalizationRules);
        return bluebird.mapSeries(phraseArray, (value, index, array) =>{
          return Word.addWordWithFrequency(value)
        } );
      },
      /**
       * @param {Object} wordObject [an map of values for the word]
       * @see addPhrase
       * @see Model.findOrInitialize
       * @returns {Promise}
      */
      addWordWithFrequency: function(wordObject){
        let wordString = wordObject.word, frequency = wordObject.frequency;
        const Word = db.models['word'];
        if(!wordString) throw 'no word';
        if(!frequency) throw 'no frequency';
        return Word.findOrInitialize({where: {word: wordString}})
            .spread(
              (word, initialized) =>
                word.set(
                  'frequency',
                  initialized ? frequency : word.frequency + frequency)
                )
            .then (word => word.save())
      },
      mostLikely(limit = 20) {
        const Word = db.models['word'];
        return Word.findAll({
          order: [
            ['frequency', 'DESC']
          ],
          limit: limit
        })
      }
    },
    /** @lends Word.prototype */
    instanceMethods: {
      /**
       * [calculates the unigram probability across the entire table]
       * @this {Object} [the word instance]
       * @return {Number} [the probability]
       */
      unigramProbability(){
        let word = this;
        const Word = db.models['word'];
        return Word.sum('frequency')
                   .then( result => Math.floor(word.frequency / result * 10000) )
        }
      }
    }
  )}
