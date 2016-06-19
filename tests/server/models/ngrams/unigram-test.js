var sinon = require( 'sinon' );
var expect = require( 'chai' )
  .expect;
var should = require( 'chai' )
  .should();

var Sequelize = require( 'sequelize' );
var dbURI = 'postgres://localhost:5432/testing-fsg';
const Bluebird = require( 'bluebird' );
var db = new Sequelize( dbURI, {
  logging: false
} );

require( '../../../../server/db/models/ngrams/unigram' )( db );

let Word;

describe( 'Word model', function () {
  beforeEach( 'Sync DB', function () {
    return db.sync( {
      force: true
    } );
  } );
  beforeEach( 'Define Word Model', function () {
    Word = db.model( 'word' );
    return Word;
  } );

  describe( 'definition', function () {
    let wordSeed = {
      word: "I"
    };
    beforeEach( function ( done ) {
      return Word.create( wordSeed )
        .then( () => done() )
        .catch( done );
    } );
    it( 'takes a new word and sets to frequency 1', function ( done ) {
      return Word.incrementWord( "am" )
        .then( word => word.frequency.should.equal( 1 ) )
        .then( () => done() )
        .catch( done )
    } );
    it( 'takes an existing word and increments frequency', function ( done ) {
      return Word.incrementWord( "I" )
        .then( () => Word.findOne( {
          where: {
            word: "I"
          }
        } ) )
        .then( word => word.frequency.should.equal( 2 ) )
        .then( () => done() )
        .catch( done )
    } );
    it( 'takes a tuple of words and increments', function ( done ) {
      return Word.incrementTuple( [ "i", "sam" ] )
        .spread( ( iInstance, samInstance ) => [
          iInstance.frequency.should.equal( 1 ),
          samInstance.frequency.should.equal( 1 )
        ] )
        .then( () => done() )
        .catch( done );
    } )
    it( 'correctly increments a tuple when one already exists', function ( done ) {
      return Word.incrementWord( "i" )
        .then( () => Word.incrementTuple( [ "i", "sam" ] )
          .spread( ( iInstance, samInstance ) => [
            iInstance.frequency.should.equal( 2 ),
            samInstance.frequency.should.equal( 1 )
          ] ) )
        .then( () => done() )
        .catch( done )
    } )
  } );

  describe( 'class methods', function () {
    /**
     * @see addPhrase
     * @type test
     */
    describe( '.addPhrase', function () {
      it( 'takes an entire template string and correctly interprets', function ( done ) {
        return Word.addPhrase( greenEggsAndHam )
          .then( result => Word.findOne( {
            where: {
              word: "i"
            }
          } ) )
          .then( word => word.frequency.should.be.above( 10 ) )
          .then( () => done() )
          .catch( done );
      } );
    } );
    describe( '.mostLikely', function () {
      beforeEach( 'adding corpus', function ( done ) {
        return Word.addPhrase( greenEggsAndHam )
          .then( () => {
            return done()
          } )
          .catch( done );
      } )
      it( 'returns a default of the 20 most likely words', function ( done ) {
        return Word.mostLikely()
          .then( result => {
            return [
              result[ 0 ].word.should.equal( 'not' ),
              result[ 1 ].word.should.equal( 'i' ),
              result[ 2 ].word.should.equal( 'them' ),
              result.should.have.lengthOf( 20 )
            ]
          } )
          .then( () => {
            return done()
          } )
          .catch( done )
      } )
    } )
  } );

  describe( 'Instance Methods', function () {
    /**
     * @see unigramProbability
     * @type test
     */
    describe( '.unigramProbability', function () {

      beforeEach( 'add some words', function ( done ) {
        return Word.addPhrase( 'sam sam sam sam I am green sam' )
          .then( () => done() )
          .catch( done );
      } );
      it( 'look up the probability of a word', function ( done ) {
        return Word.findOne( {
            where: {
              word: "i"
            }
          } )
          .then( word => word.unigramProbability() )
          .then( probability => probability.should.be.within( 1, 10000 ) )
          .then( () => done() )
          .catch( done )
      } );
      it( 'unigram probability should be an integer out of 10,000', function ( done ) {
        let greenProbability =
          Word.findOne( {
            where: {
              word: "green"
            }
          } )
          .then( word => word.unigramProbability() )
        let samProbability =
          Word.findOne( {
            where: {
              word: "sam"
            }
          } )
          .then( word => word.unigramProbability() )
        return Bluebird.all( [ greenProbability, samProbability ] )
          .spread( ( greenP, samP ) => [
            greenP.should.equal( 1250 ),
            samP.should.equal( 6250 )
          ] )
          .then( () => done() )
          .catch( done );
      } );
      it( 'unigram probability is a virtual property', function ( done ) {
        return Word.findOne( {
            where: {
              word: "am"
            }
          } )
          .then( am => am.unigramP )
          .then( amProbability => amProbability.should.equal( 1250 ) )
          .then( () => done() )
          .catch( done )
      } )
    } );
  } );
} );

let wordSeeds = [ "I", "am", "Sam", "Sam", "I", "am", "I", "do", "not", "like", "Green", "Eggs", "and", "Ham" ]

let greenEggsAndHam = String.raw `I AM SAM. I AM SAM. SAM I AM.

THAT SAM-I-AM! THAT SAM-I-AM! I DO NOT LIKE THAT SAM-I-AM!

DO WOULD YOU LIKE GREEN EGGS AND HAM?

I DO NOT LIKE THEM,SAM-I-AM.
I DO NOT LIKE GREEN EGGS AND HAM.

WOULD YOU LIKE THEM HERE OR THERE?

I WOULD NOT LIKE THEM HERE OR THERE.
I WOULD NOT LIKE THEM ANYWHERE.
I DO NOT LIKE GREEN EGGS AND HAM.
I DO NOT LIKE THEM, SAM-I-AM.

WOULD YOU LIKE THEM IN A HOUSE?
WOULD YOU LIKE THEN WITH A MOUSE?

I DO NOT LIKE THEM IN A HOUSE.
I DO NOT LIKE THEM WITH A MOUSE.
I DO NOT LIKE THEM HERE OR THERE.
I DO NOT LIKE THEM ANYWHERE.
I DO NOT LIKE GREEN EGGS AND HAM.
I DO NOT LIKE THEM, SAM-I-AM.

WOULD YOU EAT THEM IN A BOX?
WOULD YOU EAT THEM WITH A FOX?

NOT IN A BOX. NOT WITH A FOX.
NOT IN A HOUSE. NOT WITH A MOUSE.
I WOULD NOT EAT THEM HERE OR THERE.
I WOULD NOT EAT THEM ANYWHERE.
I WOULD NOT EAT GREEN EGGS AND HAM.
I DO NOT LIKE THEM, SAM-I-AM.

WOULD YOU? COULD YOU? IN A CAR?
EAT THEM! EAT THEM! HERE THEY ARE.

I WOULD NOT, COULD NOT, IN A CAR.

YOU MAY LIKE THEM. YOU WILL SEE.
YOU MAY LIKE THEM IN A TREE!

I WOULD NOT, COULD NOT IN A TREE.
NOT IN A CAR! YOU LET ME BE.
I DO NOT LIKE THEM IN A BOX.
I DO NOT LIKE THEM WITH A FOX.
I DO NOT LIKE THEM IN A HOUSE.
I DO NOT LIKE THEM WITH A MOUSE.
I DO NOT LIKE THEM HERE OR THERE.
I DO NOT LIKE THEM ANYWHERE.
I DO NOT LIKE GREEN EGGS AND HAM.
I DO NOT LIKE THEM, SAM-I-AM.

A TRAIN! A TRAIN! A TRAIN! A TRAIN!
COULD YOU, WOULD YOU ON A TRAIN?

NOT ON TRAIN! NOT IN A TREE!
NOT IN A CAR! SAM! LET ME BE!
I WOULD NOT, COULD NOT, IN A BOX.
I WOULD NOT, COULD NOT, WITH A FOX.
I WILL NOT EAT THEM IN A HOUSE.
I WILL NOT EAT THEM HERE OR THERE.
I WILL NOT EAT THEM ANYWHERE.
I DO NOT EAT GREEM EGGS AND HAM.
I DO NOT LIKE THEM, SAM-I-AM.

SAY! IN THE DARK? HERE IN THE DARK!
WOULD YOU, COULD YOU, IN THE DARK?

I WOULD NOT, COULD NOT, IN THE DARK.

WOULD YOU COULD YOU IN THE RAIN?

I WOULD NOT, COULD NOT IN THE RAIN.
NOT IN THE DARK. NOT ON A TRAIN.
NOT IN A CAR. NOT IN A TREE.
I DO NOT LIKE THEM, SAM, YOU SEE.
NOT IN A HOUSE. NOT IN A BOX.
NOT WITH A MOUSE. NOT WITH A FOX.
I WILL NOT EAT THEM HERE OR THERE.
I DO NOT LIKE THEM ANYWHERE!

YOU DO NOT LIKE GREEN EGGS AND HAM?

I DO NOT LIKE THEM, SAM-I-AM.

COULD YOU, WOULD YOU, WITH A GOAT?

I WOULD NOT, COULD NOT WITH A GOAT!

WOULD YOU, COULD YOU, ON A BOAT?

I COULD NOT, WOULD NOT, ON A BOAT.
I WILL NOT, WILL NOT, WITH A GOAT.
I WILL NOT EAT THEM IN THE RAIN.
NOT IN THE DARK! NOT IN A TREE!
NOT IN A CAR! YOU LET ME BE!
I DO NOT LIKE THEM IN A BOX.
I DO NOT LIKE THEM WITH A FOX.
I WILL NOT EAT THEM IN A HOUSE.
I DO NOT LIKE THEM WITH A MOUSE.
I DO NOT LIKE THEM HERE OR THERE.
I DO NOT LIKE THEM ANYWHERE!
I DO NOT LIKE GREEN EGGS AND HAM!
I DO NOT LIKE THEM, SAM-I-AM.

YOU DO NOT LIKE THEM. SO YOU SAY.
TRY THEM! TRY THEM! AND YOU MAY.
TRY THEM AND YOU MAY, I SAY.

sAM! IF YOU LET ME BE,
I WILL TRY THEM. YOU WILL SEE.

(... and he tries them ...)

SAY! I LIKE GREEN EGGS AND HAM!
I DO! I LIKE THEM, SAM-I-AM!
AND I WOULD EAT THEM IN A BOAT.
AND I WOULD EAT THEM WITH A GOAT...
AND I WILL EAT THEM, IN THE RAIN.
AND IN THE DARK. AND ON A TRAIN.
AND IN A CAR. AND IN A TREE.
THEY ARE SO GOOD, SO GOOD, YOU SEE!
SO I WILL EAT THEM IN A BOX.
AND I WILL EAT THEM WITH A FOX.
AND I WILL EAT THEM IN A HOUSE.
AND I WILL EAT THEM WITH A MOUSE.
AND I WILL EAT THEM HERE AND THERE.
SAY! I WILL EAT THEM ANYWHERE!
I DO SO LIKE GREEN EGGS AND HAM!
THANK YOU! THANK YOU, SAM I AM.
`

function parsePhrase( phraseTemplate, normalizationArray ) {
  let phraseParser = /[\w\-]+|[\.\!\,\?]|<n>|<s>|<\/s>/g
  let phraseToMatch = phraseTemplate.toLowerCase();
  let normalizedPhrase = `<s>${normalizationArray.forEach(rule => phraseToMatch.replace(rule[0], rule[1]))}</s>`
  return normalizedPhrase.match( phraseParser );
}

const normalization = [
  // [regex, replace value]
  [ /\n/g, '<n>' ],
  [ /[\.\!\,\?]/g, '$&</s><s>' ]
]

function seedPhrase( phrase ) {
  let parsedPhrase = parsePhrase( phrase )
  return Bluebird.each( parsedPhrase, ( word ) => Word.incrementWord( word ) )
}
