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

/** @class Word */
module.exports = function (db) {
  db.define('word', {
    /** @constructs Word */
    word: {
      type: Sequelize.STRING,
      unique: true
    },
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    unigramP: {
      type: Sequelize.VIRTUAL,
      get: function() {
        return this.unigramProbability();
      }
    }
  }, {
    /** @lends Word */
    classMethods: {
      /**
       * [incrementWord description]
       * @summary adds or increments a word
       * @param  {String} word [the word to add]
       * @return {Object}      [instance of Word]
       */
      incrementWord(word){
        const Word = db.models['word'];
        return Word.findCreateFind({where: {word}})
                   .spread( (word, created) => {
                     if(!word) throw 'no word'
                     return [word, created];
                   })
                   .spread( (word, created) => {
                     if(created) return word;
                     return word.increment('frequency')
                   })
                   .catch(err => err);
      },
      /**
       * [parseText parses raw text into an array]
       * @param  {String} rawText [a string or String.raw template literal, possibly with multiple lines]
       * @param  {Array.<Array.<RegExp, String>>} [normalizationRules = defaultRules]
       * @return {Array.<String>}         [raw]
       */
      parseText: function(rawText, normalizationRules = defaultRules, parseMatcher = phraseParser()){
        let phraseToMatch = rawText.toLowerCase();
        // let normalizedPhrase = normalizationRules.reduce( (phrase, rule) => phrase.replace(rule[0], rule[1]), phraseToMatch)
        // let normalizedPhraseWithStartAndEnd = `<s>${normalizedPhrase}</s>`
        let matchedPhraseArray = phraseToMatch.match(parseMatcher);
        let sorted = new Map();
        matchedPhraseArray.forEach( (word, index) => {
          if( typeof word !== 'string' ) {return;}
          else {
              let frequency = sorted.get(word) || 1;
              let newFrequency = frequency + 1;
              sorted.set(word, newFrequency);
          };
        })
        // console.log(sorted);
        // let countedMatches = _.countBy( sorted );
        // let filteredMatches = _.filter( countedMatches,
        //   function(value, key) {
        //     console.log('the values:',value, key, typeof key, typeof +key );
        //     return (typeof +key === 'string')
        //   } )
        // console.log('the keys:',Object.keys( filteredMatches ))
        let matchCollection = [];
        for(var entry of sorted) {
          matchCollection.push( {word: entry[0], frequency: entry[1]} );
        }

        // let matchCollection = sorted.map( entry => {
        //   return {word: entry[0], frequency: entry[1]}
        // })
        // let matchCollection = _.map(sorted, (value, key, collection) => {
        //
        //     return {word: key, frequency: value}
        //
        // })
        return matchCollection;
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
        console.log(phraseArray);
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
