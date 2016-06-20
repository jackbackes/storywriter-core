'use strict';
var _ = require( 'lodash' );
var Sequelize = require( 'sequelize' );
const Bluebird = require( 'bluebird' );
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
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {
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
          /** @return {Promise.<Array.<string>>} [raw] */
        return Bluebird.resolve( bigramMap )
      },
      addPhrase( storyObject ) {
        const Word = db.models[ 'word' ];
        const Bigram = db.models[ 'bigram' ];
        console.log( '...parsing Story' )
        return Bigram
          .parseText( storyObject )
          .map( bigramTuple => {
            let wordTokenOne = Word.findOne( {
              where: {
                word: bigramTuple[ 0 ]
              }
            } )
            let wordTokenTwo = Word.findOne( {
              where: {
                word: bigramTuple[ 1 ]
              }
            } )
            return Bluebird.all( [ wordTokenOne, wordTokenTwo ] )
              .spread( ( foundWordOne, foundWordTwo ) => {
                let instance = Bigram.build();
                instance.setTokenOne( foundWordOne, {
                  save: false
                } );
                instance.setTokenTwo( foundWordTwo, {
                  save: false
                } );
                return Bigram.findOne( {
                    where: {
                      tokenOneId: instance.tokenOneId,
                      tokenTwoId: instance.tokenTwoId
                    }
                  } )
                  .then( foundBigram => {
                    if ( !foundBigram ) {
                      return instance.save();
                    } else {
                      console.log( 'incrementing', foundBigram.get( {
                        plain: true
                      } ) )
                      foundBigram.increment( 'frequency' );
                    }
                  } )
              } )
          } )
          .then( result => {
            console.log( 'done' );
            return result;
          } )
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
        if ( !bigramTuple ) throw 'Bigram.train must be called with a Bigram Tuple'
        if ( !Array.isArray( bigramTuple ) ) throw 'must pass bigram tuple into train. use trainText or trainCorpusText for parsing';
        let [ tokenOne, tokenTwo ] = bigramTuple;
        let tokenOneObj = {
          word: tokenOne
        };
        let tokenTwoObj = {
          word: tokenTwo
        };
        let createTokens = Word.bulkCreate( [ tokenOneObj, tokenTwoObj ], {
          logging: true,
          returning: true
        } )
        return createTokens
          .spread( ( tokenOneResult, tokenTwoResult ) => {
            let newBigram = Bigram.build();
            newBigram.set( 'tokenOneId', tokenOneResult.id );
            newBigram.set( 'tokenTwoId', tokenTwoResult.id );
            return newBigram.save();
          } )
      },
      mostLikely( tokenOne, limit = 20 ) {
        const Word = db.models[ 'word' ];
        const Bigram = db.models[ 'bigram' ];
        if ( !tokenOne ) {
          let bigrams = Bigram.findAll( {
            order: [
              [ 'frequency', 'DESC' ]
            ],
            limit: limit
          } )
          console.log( 'mapping tokens' );
          return Bluebird.map( bigrams, bigram => {
            let tokens = Bigram.mapTokens( bigram );
            return Bluebird.all([bigram, tokens]).spread( (bigramR, tokenR) => {
              return {
                bigram: bigramR,
                tokens: tokenR
              }
            })
          })
        } else {
          return Word.findOne( {
              where: {
                word: tokenOne
              }
            } )
            .then( word => {
              let wordId = word.id;
              let bigrams = Bigram.findAll( {
                where: { tokenOneId: wordId },
                order: [
                  [ 'frequency', 'DESC' ]
                ],
                limit: limit
              } )
              return Bluebird.map( bigrams, bigram => {
                let tokens = Bigram.mapTokens( bigram );
                return Bluebird.all([bigram, tokens]).spread( (bigramR, tokenR) => {
                  return {
                    bigram: bigramR,
                    tokens: tokenR
                  }
                })
              })
            } )
        }
      },
      mapTokens( bigram ) {
        // let bigram = this;
        const Word = db.models[ 'word' ];
        const Bigram = db.models[ 'bigram' ];
        return Word.findOne( {
            where: {
              id: bigram.tokenOneId
            }
          } )
          .then( wordOne => {
            return Word.findOne( {
                where: {
                  id: bigram.tokenTwoId
                }
              } )
              .then( wordTwo => {
                return [ wordOne, wordTwo ]
              } )
          } )
      }
    }
  } )
}
