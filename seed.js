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
var Bluebird = require('bluebird');
const fs = require('fs');
var Promise = require('sequelize').Promise;
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

//path definitions
const serverPath = path.join(__dirname, 'server')
const dbPath = path.join(serverPath, 'db')
const modelPath = path.join(dbPath, 'models')
const nGramPath = path.join(modelPath, 'ngrams')
const bigramPath = path.join(nGramPath, 'bigram.js')

//model definitions
const Bigram = db.model('bigram');

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

function seedPhrase (phrase) {
  return Word.addPhrase(phrase)
}


function story(title, storyPath, categories){
  return {title, path: path.join(__dirname, 'resources/corpus', storyPath), categories}
}

let storySeeds = new Map()
  .set('Green_Eggs_And_Ham', story('Green Eggs And Ham', 'greeneggsandham.txt', ['Dr. Seuss', 'poem'] ))
  .set('Fairy_Tales_Every_Child_Should_Know', story('Fairy Tales Every Child Should Know', 'fairyTales/__pg14916.txt', ['Fairy Tale', 'Anthology']))
  .set('Folk_Tales_Every_Child_Should_Know', story('Folk Tales Every Child Should Know', 'folkTales/pg15164.txt', ['Folk Tale', 'Anthology']))
  .set('Good_Cheer_Stories_Every_Child_Should_Know', story('Good Cheer Stories Every Child Should Know', 'goodCheer/pg19909.txt', ['Good Cheer', 'Anthology']))
  .set('Hero_Stories_Every_Child_Should_Know', story('Hero Stories Every Child Should Know', 'hero/pg4265.txt', ['Hero Story', 'Anthology']))
  .set('Legends_Every_Child_Should_Know', story('Legends Every Child Should Know', 'legend/pg6622.txt', ['Legend', 'Anthology']))
  .set('Myths_Every_Child_Should_Know', story('Myths Every Child Should Know', 'myth/pg16537.txt', ['Myth', 'Anthology']))
  .set('Poems_Every_Child_Should_Know', story('Poems Every Child Should Know', 'poem/pg16436.txt', ['Poem', 'Anthology']))
  .set('Wonder_Stories_Every_Child_Should_Know', story('Wonder Stories Every Child Should Know', 'wonder/pg19461.txt', ['Wonder Story', 'Anthology']))
  .set('Famous_Stories_Every_Child_Should_Know', story('Famous Stories Every Child Should Know', 'famousStories/pg16247.txt', ['Famous Story', 'Anthology']))

  function getTextSync(story) {
    return fs.readFileSync(story.path, 'utf8')
  }



db.sync({ force: true })
    .then( () => Promise.each(storySeeds, story => {
            let [id, storyObject] = story;
            return seedPhrase(getTextSync(storyObject));
      }))
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
