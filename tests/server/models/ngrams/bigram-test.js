'use strict';

var sinon = require( 'sinon' );
var expect = require( 'chai' )
  .expect;
var should = require( 'chai' )
  .should();

var Sequelize = require( 'sequelize' );
var dbURI = 'postgres://localhost:5432/testing-fsg';
const bluebird = require( 'bluebird' );
var db = new Sequelize( dbURI, {
  logging: false
} );

require( '../../../../server/db/models/ngrams/bigram' )( db );

let Bigram;

describe( 'Bigram model', function () {
  beforeEach( 'Sync DB', function () {
    return db.sync( {
      force: true
    } );
  } );
  beforeEach( 'Define Bigram Model', function () {
    Bigram = db.model( 'bigram' );
    return Bigram;
  } );

  describe( 'class methods', function () {
    let bigramSeed = `Sam I am I am Sam`;
    it( 'parseText parses text to a frequency:bigram map', function ( done ) {
      return Bigram.parseText( bigramSeed )
        .then( parsedText => {
          console.log(parsedText);
          return parsedText;
        })
        .then( parsedText => [
          parsedText[0].should.eql( ['<s>', 'sam']),
          parsedText[1].should.eql( ['sam', 'i'] ),
          parsedText[2].should.eql( ['i', 'am']),
          parsedText[3].should.eql( ['am', 'i'])
        ] )
        .then( () => done() )
        .catch( done );
    } );
    beforeEach(function ( done ) {
      return Bigram.parseText( bigramSeed )
        .then( () => done() )
        .catch( done );
    } );
    xit( 'takes an existing bigram and sets to frequency 1', function ( done ) {
      return Bigram.incrementBigram( ["I", "am"] )
        .then( bigramPrase => bigram.frequency.should.equal( 2 ) )
        .then( () => done() )
        .catch( done )
    } );
    xit( 'takes a new bigram and increments frequency', function ( done ) {
      return Bigram.incrementWord( ["am", "sam"])
        .then( () => Bigram.findOne( {
          where: {
            bigram: "I"
          }
        } ) )
        .then( bigram => bigram.frequency.should.equal( 1 ) )
        .then( () => done() )
        .catch( done )
    } );
  } );

  xdescribe( 'Instance Methods', function () {} );
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
  return bluebird.each( parsedPhrase, ( word ) => Word.incrementWord( word ) )
}
