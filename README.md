# Story Writer
## Story writer helps you write stories for kids.
### Based on a corpus of (9) anthologies of children's literature, plus
Green Eggs and Ham.



# More information on Natural Language Processing:


### "Sam I Am"
![alt-text](http://vignette3.wikia.nocookie.net/moviepedia/images/2/21/Sam-I-Am.png/revision/latest?cb=20141003130005)


### An Introduction to
# Language Modeling
### With N-Grams and Markov Chains



# Natural Language Processing


## Topics


- Regular Expressions
- Word Tokenization
- Word Normalization and Stemming
- Sentence Segmentation
- Minimum Edit Distance
- Language Modeling
  - **_N-Grams_**
  ===============

- Spelling Correction
  - Noisy Channel
  - Real-World
- Text Classification
  - Naive Bayes Algorithm
- Sentiment Analysis
- Modeling text features
- Maxent and NLP
- Information Extraction
  - Named Entity Recognition
  - Relation Extraction
    - Semi-supervised and supervised
- Parts of speech


- Syntactic Structure
- Context-free grammars
  - Probabalistic CFGs
  - Constituency Parsing
  - Lexicalization
- Information Retrieval
  - Term-Document Incidence Matrix
  - Inverted index
  - Querying
  - Ranked Retrieval and Term Ranking
  - Documents as Vectors


- Word Sense
  - Word Relation
  - Word Similarity
  - Thesauruses (Thesaurusi?)
- Question Answering
  - Query Formulation and Answer Types
  - Using Knowledge
  - Answering Complex Questions
- Summarization



# N-grams


## Examples


## He vs She Trigrams
![alt-text](http://chrisharrison.net/projects/trigramviz/HESHEGraphWordsViz1.jpg) "He and She Trigrams"


## I vs You Trigrams
![alt-text](http://chrisharrison.net/projects/trigramviz/IYOUGraphWordsViz1.jpg) "I and You Trigrams"



# N-Grams
## What is it?
A Language Modeling Tool
> N = 1 : "Unigram (or, you know, a _word_)"
>  ie: "The"

> N = 2 : "Bigram"
>  ie: "The Cat"

> N = 3 : "Trigram", etc.
>  ie: "The Cat sat"

> N = 4 : "Four-gram", "Five-Gram", etc.


## Formal Definition
#### In the fields of computational linguistics and probability, an n-gram is:


#### a contiguous sequence of n items from a given sequence of text or speech.


#### The items can be **phonemes, syllables, letters, words or base pairs** according to the application.


#### The n-grams typically are collected from a text or speech corpus.



# N-grams
## Unigram Example


> I would not eat them with a Fox!

> I would not eat them in a box!


frequency | token | (Probability)
--------- | ----- | -------------
2         | `<s>`   |    0.095
2         | i     |    0.095
2         | would |    0.095
2         | not   |    0.095
2         | eat   |    0.095
2         | them  |    0.095
1         | with  |    0.055
2         | a     |    0.095


frequency | token | (Probability)
--------- | ----- | -------------
1         | fox   |    0.055
2         | `</s>`  |    0.095
1         | in    |    0.055
1         | a     |    0.055
1         | box   |    0.055
21        | 13    |    1


numbers get very small, so
probability is often done in log space


# N-grams
## A Bigram example

> I would not eat them with a Fox!

> I would not eat them in a box!


frequency | word1 | word2 | (Probability)
--------- | ----- | ----- | -------------
2         | `<s>`   | i     |    0.1111
2         | i     | would |    0.1111
2         | would | not   |    0.1111
2         | not   | eat   |    0.1111
2         | eat   | them  |    0.1111
1         | them  | in    |    0.0556
1         | in    | a     |    0.0556


frequency | word1 | word2 | (Probability)
--------- | ----- | ----- | -------------
1         | a     | box   |    0.0556
1         | box   |  `</s>` |    0.0556
1         | them  | with  |    0.0556
1         | with  | a     |    0.0556
1         | a     | fox   |    0.0556
1         | fox   | `</s>`  |    0.0556


# N-Grams
## When is it Useful?

When you use Markov chains!



# N-Grams and Markov Chains
"A [Markov chain](http://en.wikipedia.org/wiki/Markov_chain) is a probabilistic model well suited to [semi-coherent text synthesis](http://megahal.alioth.debian.org/How.html)."


Probability of word 2 given word 1 => P[w2|w1]


Markalvin and Hobbes
![alt-text](http://www.joshmillard.com/markov/calvin/images/calkov-4344106492004371456.jpg)


Markov College Essays!

Today's world around me blind. In just one of energy. _While straining to live in Ukraine_ with anxiety and broad range of my surroundings, along the ones I felt physically threatened and the rush I burst into a ten-year old who they sought a poem that matters, I was I should be invincible. Who would have paid for granted, but maybe it was asked to further education is an annual overnight to San Diego, water fun, cheers, a year, I still burn in the invisible enemy in the night when I cannot feel the traffic outside the times I want to a missionary would be neither relived nor reanimated. I assume the status quo, seems fair; I were a stylish figure, for me, and knees.



# The Markov Model
> The Probability of a word depends only the probability of the n-previous words.

![alt-text](http://sookocheff.com/img/nlp/ngram-modeling-with-markov-chains/learned-probabilities.png)


# Markov Chain
## Green Eggs and Ham

## Bigram Chains


#### Conditional Probability of a Bigram Chain
P(Second|First)
  =>  	P(First and Second) / P(First)
Given "I" what does our markov chain look like?

All 100% probability:
```
[i, would] => [would, not] => [not, eat] => [eat, them]...
```

What's the probability of "with a fox"?
```
[eat, them]
    => [them, in]
        ( 1/18 )/( 1/9 ) = 50%
        => [in, a]
           ( 1/18 )/( 1/18 ) = 100%
           => [a, box]
              ( 1/18 )/( 1/9 ) = 50%
*remember the equation P(W1|W2) = P(W1 and W2) / P(W1)
```


"I would not eat them with a fox"
## Probability is 25% (1 in 4).
### Other options are:


# "in a box"


# "with a box"


# "in a fox" ???????



# Markov chains and Trigrams
P( _Wi_ | _Wi-1Wi-2_ )
  =>  	P( _Wi_) / P(First)
Given "I" what does our trigram chain look like?


> I would not eat them with a Fox!

> I would not eat them in a box!


frequency | word1 | word2 | word3 | (Probability)
--------- | ----- | ----- | ----- | -------------
2         | `<s>`   | i     | would |   2/16
2         | i     | would | not   |   2/16
2         | would | not   | eat   |   2/16
2         | not   | eat   | them  |   2/16
1         | eat   | them  | in    |   1/16
1         | them  | in    | a     |   1/16
1         | in    | a     | box   |   1/16


frequency | word1 | word2 | word3 | (Probability)
--------- | ----- | ----- | ----- | -------------
1         | a     | box   | `</s>`  |   1/16
1         | eat   | them  | with  |   1/16
1         | them  | with  | a     |   1/16
1         | with  | a     | Fox   |   1/16
1         | a     | fox   | `</s>`  |   1/16


All 100% probability:
```
[<s>, i, would] => [would, eat, them]
```

What's the probability of "with a fox"?
```
[would, eat, them]
    => [eat, them, with]
        ( 1/16 )/( 2/16 ) = 50%
        => [with, a, Fox]
           ( 1/18 )/( 1/18 ) = 100%
        => [in , a, box]
           ( 1/18 )/( 1/18 ) = 100%
*remember the equation P(W1|W2) = P(W1 and W2) / P(W1)
```


## Trigram model correctly guesses 50% chance of each direction.
### But the more "n"s makes your language more fragile.

### There are a number of "backoff" algorithms smartly choose which "n" to use.



# N-Grams
## Where to Find them


## American English: Breakfast Foods
<iframe name="ngram_chart" src="https://books.google.com/ngrams/interactive_chart?content=pancake%2Cwaffle%2Cpeanut+butter%2Cmilkshake%2Corange+juice%2Cflaxseed&year_start=1900&year_end=2008&corpus=17&smoothing=3&share=&direct_url=t1%3B%2Cpancake%3B%2Cc0%3B.t1%3B%2Cwaffle%3B%2Cc0%3B.t1%3B%2Cpeanut%20butter%3B%2Cc0%3B.t1%3B%2Cmilkshake%3B%2Cc0%3B.t1%3B%2Corange%20juice%3B%2Cc0%3B.t1%3B%2Cflaxseed%3B%2Cc0" width=900 height=500 marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no></iframe>


## British English, Breakfast Foods
<iframe name="ngram_chart" src="https://books.google.com/ngrams/interactive_chart?content=pancake%2Cwaffle%2Cpeanut+butter%2Cmilkshake%2Corange+juice%2Cflaxseed&year_start=1900&year_end=2008&corpus=18&smoothing=3&share=" width=900 height=500 marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no></iframe>


### More sources in the resources section.


# N-Grams
## How do you generate them from your text?


# Sequelize / PSQL example


# Normalization and Unigram Parse
```
// the default normalization rules
  let defaultRules = [
    // [regex,         'replace']
       [/\n/g,         '<n>'], // <== replaces carriage returns with a newline token
       [/[\.\!\?]/g, '<s>'] // <== replaces end of sentences with a phrase-stop token
  ]
// simple word and hyphenated word parser
// these can get a LOT more complicated
  let defaultPhraseParser = /[\w\-]+/g
// .parseText applies the normalization and
// parseMatcher Regular Expressions to the
// raw text
  Unigram.parseText( rawText, normalizationRules, parseMatcher)
```


# Normalization and Unigram Parse
## Result
```
tokens = [
  '<s>', 'i', 'am', 'sam', 'sam', 'i', 'am', '<s>''that', 'sam-i-am', 'that', 'sam-i-am', 'i', 'do', 'not', 'like', 'that', 'sam-i-am', '<s>', etc...
].map( token => {word: token} )
Word.bulkCreate(tokens) // is really fast ( 2-3 minutes )
```


# Bigram Parse and Training
## Tokenization
```
bigramMap = [ [ '<s>', tokens[0] ] ]
tokens.forEach( token, i, textArray => {
  if( i < textArray.length) bigramMap.push( token, token[textArray.length - 1] )
  else bigramMap.push( [token, '</s>'])
  })
// Bigram.bulkCreate takes a LOT longer because of  eager loading. 20-30 minutes.
```


# Trigram Parse and Training



# Implementing Mr. Markov
```
function wordTree( depth = 2, word = 'the', which = 'one' ) {
        if ( depth < 1 ) return;
        return $http.get( '/api/v1/ngram/bigram/' + word )
          .then( response => {
            let suggestions = response.data
              .map( bigram => bigram.tokens[ 1 ].word )
            let suggestion = suggestions[ Math.floor( Math.random() * suggestions.length ) ]
            let whichOne = 'wordTreeSuggestions' + which;
            scope[ whichOne ] += " " + suggestion;
            return wordTree( depth - 1, suggestion, which );
          } )
      };
```



# Resources
## Videos
## Libraries
## Datasets & Corpus


# Resources
## Videos
- Dan Jurafsky & Chris Manning of StanfordNLP:
  - [Natural Language Processing](https://www.youtube.com/playlist?list=PL6397E4B26D00A269): Free 100+ video walkthrough on the core of NLP. Watch it on the train.


# Resources
## Libraries
- [Stanford NLP on Github](https://github.com/stanfordnlp)

## Datasets & Corpus & Fun
- [Chris Harrison's Web Trigrams](http://www.chrisharrison.net/index.php/Visualizations/WebTrigrams)
- [Corpus of Contemporary English](http://www.ngrams.info/) - free and paid versions. 520,000,000 words.
- [Microsoft AI] (https://www.microsoft.com/cognitive-services/en-us/text-analytics-api)
