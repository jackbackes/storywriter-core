/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
const Word = db.model('word');
var bluebird = require('bluebird');
var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};


// let wordSeeds = ["I", "am", "Sam", "Sam", "I", "am", "I", "do", "not", "like", "Green", "Eggs", "and", "Ham"]

let greenEggsAndHam = String.raw`I AM SAM. I AM SAM. SAM I AM.

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

function parsePhrase (phraseTemplate) {
  let phraseParser = /[\w\-]+|[\.\!\,\?]|<n>|<s>|<\/s>/g
  let phraseToMatch = phraseTemplate.toLowerCase();
  let normalizedPhrase = '<s>' + phraseToMatch.replace(/\n/g, '<n>').replace(/[\.\!\,\?]/g, '$&</s><s>') + '</s>'
  return normalizedPhrase.match(phraseParser);
}



function seedPhrase (phrase) {
  // let parsedPhrase = parsePhrase(phrase)
  return Word.addPhrase(phrase)
}

// function seedPhrases (phraseList) {
//   return phraseList.map( phrase => seedPhrase(phrase) );
// }





db.sync({ force: true })
    .then(function() {
      return seedPhrase(greenEggsAndHam);
    })
    .then(function () {
        return seedUsers();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
