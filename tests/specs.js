describe('storywriter core', function(){
  xit('helps you write kids-stories')
  describe('textbox', function(){
    it('creates a textbox')
    it('gives you a short writing prompt')
    it('as you start writing, it suggests the next word or phrase')
    it("refreshes the search on punctuation [' ', '.', ',']")
    it('suggestions come from a corpus of childrens literature')
    it('looks up the the ngram when you start typing')
    it('uses bootstrap ui typeahead')
    it('can tag words as characters')
    it('analyzes sentiment of your story')
  })
  describe('models', function(){
    it('has a dictionary')
    it('has a normalized oneGram model')
    it('has a method that calculates the probability of a word')
    it('parses an input text into an n-gram table')
    it('gets a list of texts')
    it('parses multiple input texts')
    it('has a bigram model')
    it('has a method that calculates the probability of a bigram')
    it('has a trigram model')
    it('has a method that calculates the probability of a trigram')
    it('pulls metadata from texts')
    it('calculates metadata probability given text written')
  })
  describe('sound effects', function(){
    it('procedurally generates music')
    it('generates music based on sentiment of your story')
    it('generates music based on your story timeline')
  })
})
