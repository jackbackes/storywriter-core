'use strict';
var _ = require( 'lodash' );
var Sequelize = require( 'sequelize' );
const Bluebird = require( 'Bluebird' );
const ngramUtils = require( './utils' );

/**
 * [defaultRules are the default Normalization Rules used by Word.parseText()]
 * @type {Array.<Array.<RegExp, String>>}
 * @see utils
 * @borrows utils
 */
const {
  defaultRules,
  defaultPhraseParser,
  phraseParser,
  negArray
} = ngramUtils;

/**
 * Bigram
 * @category model
 */
module.exports = function ( db ) {
    db.define( 'bigram', {
      /** @constructs Bigram */
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
      frequency: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    }, {
      initialAutoIncrement: 1,
      /** @lends Bigram */
      classMethods: {
        addAssociations( database = db ) {
          const Bigram = db.model( 'bigram' );
          const Word = db.model( 'word' );
          Bigram.belongsTo( Word, {
              as: 'tokenOne'
            } ),
            Bigram.belongsTo( Word, {
              as: 'tokenTwo'
            } )
          return Bigram;
        },
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
         * [parseText parses raw text into an array of lowercase bigram tuples]
         * @example
         * <caption>
         * 	`I am Sam Sam I am`
         * 	becomes
         * 	[ [ '<s>', 'sam' ],[ 'sam', 'i' ],[ 'i', 'am' ],[ 'am', 'i' ],[ 'i', 'am' ],[ 'am', 'sam' ],[ 'sam', '</s>' ] ]
         * </caption>
         * @param  {String} textToParse [a string or String.raw template literal, possibly with multiple lines]
         * param  {Array.<string>} [textParser = utils.defaultPhraseParser]
         */
        parseText( textToParse, textParser = phraseParser() ) {
          let unigramArray = textToParse.toLowerCase()
            .match( textParser );
          let bigramMap = [
            [ `<s>`, unigramArray[ 0 ] ]
          ];
          unigramArray.forEach( ( word, i, text ) => i === text.length - 1 ?
            bigramMap.push( [ word, `</s>` ] ) :
            bigramMap.push( [ word, text[ i + 1 ] ] ) )
          /** @return {Array.<string>} [raw] */
          return Bluebird.resolve( bigramMap )
        },
        /**
         * [train description]
         * @param  {Array.<string>} bigramTuple [description]
         * @return {Object}             [instance of the bigram]
         */
        train( bigramTuple, createFind = true ) {
          // console.log(db);
          const Word = db.model( 'word' );
          const Bigram = db.model( 'bigram' );
          Bigram.addAssociations();
          if ( !bigramTuple ) throw 'Bigram.train must be called with a Bigram Tuple'
          if ( !Array.isArray( bigramTuple ) ) throw 'must pass bigram tuple into train. use trainText or trainCorpusText for parsing';
          let [ tokenOne, tokenTwo ] = bigramTuple;
          let tokenOneObj = {
            word: tokenOne
          };
          let tokenTwoObj = {
            word: tokenTwo
          };
          let createTokens =
            Word.bulkCreate(
              [ tokenOneObj, tokenTwoObj ],
              { returning: true } );
          return createTokens
            .spread( ( tokenOneResult, tokenTwoResult ) => {
              let newBigram = Bigram.build(
                  {},
                  {include:
                    [
                      {model: Word, as: 'tokenOne'},
                      {model: Word, as: 'tokenTwo'}
                    ]
                  });
              newBigram.tokenOneId = tokenOneResult.id;
              newBigram.tokenTwoId = tokenTwoResult.id;
              return newBigram.save();
            } )
            .then( result => {
              console.log(result);
              return result;
            })
            .catch( error => {
              console.error(error)
              return error
            })
        },
        trainText( rawString ) {
          const Word = db.models.word;
          const Bigram = db.models.bigram;
          return Bigram.parseText( rawString )
            .mapSeries( bigramTuple => {
              console.log( 'training', bigramTuple );
              return Bigram.train( bigramTuple, false )
            } )
        }
      }
      // return Word.phraseParser(...arguments).then( wordArray =>
      //   wordArray.map( function(value, index, array) {
      //     if(!array[index+1]) bigramArray.push( [value, `</s>`])
      //     else bigramArray.push( [value, array[index+1]] )
      //   }));
      // },
      // /**
      //  * [addPhrase]
      //  * @param  {String} rawText [a string or String.raw template literal, possibly with multiple lines]
      //  * @param  {Array.<Array.<RegExp, String>>} [normalizationRules = defaultRules]
      //  * @see addWordWithFrequency
      //  * @return {Promise.<Array.Object>} addedWords
      // */
      // addPhrase: function(rawText, normalizationRules = defaultRules){
      //   const Word = db.models['word'];
      //   let phraseArray = Word.parseText(rawText, normalizationRules);
      //   return Bluebird.mapSeries(phraseArray, (value, index, array) =>{
      //     return Word.addWordWithFrequency(value)
      //   } );
      // },
      // /**
      //  * @param {Object} wordObject [an map of values for the word]
      //  * @see addPhrase
      //  * @see Model.findOrInitialize
      //  * @return {Promise}
      // */
      // addWordWithFrequency: function(wordObject){
      //   let wordString = wordObject.word, frequency = wordObject.frequency;
      //   const Word = db.models['word'];
      //   if(!wordString) throw 'no word';
      //   if(!frequency) throw 'no frequency';
      //   return Word.findOrInitialize({where: {word: wordString}})
      //       .spread(
      //         (word, initialized) =>
      //           word.set(
      //             'frequency',
      //             initialized ? frequency : word.frequency + frequency)
      //           )
      //       .then (word => word.save())
      // },
      // mostLikely(limit = 20) {
      //   const Word = db.models['word'];
      //   return Word.findAll({
      //     order: [
      //       ['frequency', 'DESC']
      //     ],
      //     limit: limit
      //   })
      // }
    } )
  }
  // /** @lends Word.prototype */
  // instanceMethods: {
  //   /**
  //    * [calculates the unigram probability across the entire table]
  //    * @this {Object} [the word instance]
  //    * @return {Number} [the probability]
  //    */
  //   unigramProbability(){
  //     let word = this;
  //     const Word = db.models['word'];
  //     return Word.sum('frequency')
  //                .then( result => Math.floor(word.frequency / result * 10000) )
  //     }
  //   }

// example of how to construct the bigram model
function BigramConstructor( db ) {
  /** @constructs Bigram */
  db.model( 'bigram' )
}
