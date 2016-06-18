'use strict'

/**
 * declarations
 */
let defaultRules, defaultPhraseParser;


/**
* [defaultRules are the default Normalization Rules used by Word.parseText()]
* @type {Array.<Array.<RegExp, String>>}
*/
defaultRules = [
  // [regex, replace value]
  [/\n/g, '<n>'],
  [/[\.\!\,\?]/g, '$&</s><s>']
];
/**
 * [defaultPhraseParser is used to parse an array into text]
 * @type {RegExp}
 */
defaultPhraseParser = /[\w\-]+/g;
/**
 * a wrapper that returns the defaultPhraseParser
 * @return {RegExp} [defaultPhraseParser]
 */
function phraseParser() {
  return defaultPhraseParser;
}
/**
 * [negArray is a utility that allows negative indices to be used by arrays ]
 * @param  {Array} arr [array to wrap with negativeArray proxy]
 * @return {Proxy}     [the negativeArray proxy]
 */
function negArray(arr) {
  return new Proxy(arr, {
    set: function (proxy, index, value) {
        index = parseInt(index);
        return index < 0 ? (arr[arr.length + index] = value) : (arr[index] = value);
    },
    get: function (proxy, index) {
        index = parseInt(index);
        return index < 0 ? arr[arr.length + index] : arr[index];
    }
  });
}


/**
* utils for ngram models
* @type {Object}
*/
module.exports = {defaultRules, defaultPhraseParser, phraseParser, negArray}
