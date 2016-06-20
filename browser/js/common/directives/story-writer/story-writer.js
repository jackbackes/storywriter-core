
function getStoryArray(text){
  return text.match(/\w+/g);
}

function getStoryText(element){
  return element.text()
}

app.directive('storyWriter', function($http, $state, $rootScope, $httpParamSerializerJQLike){
  return {
    link: function(scope, element, attrs){
      scope.suggestions = `{stuff: 'goes here'}`
      function wordTree (depth = 2, word = 'the', which = 'one'){
        if(depth < 1) return;
        return $http.get('/api/v1/ngram/bigram/'+word).then(response => {
          let suggestions = response.data.map( bigram => bigram.tokens[1].word)
          let suggestion = suggestions[Math.floor(Math.random()*suggestions.length)]
          console.log(suggestion);
          let whichOne = 'wordTreeSuggestions' + which;
          scope[whichOne] += " " + suggestion;
          return wordTree(depth-1, suggestion, which);
        })
      };
      scope.saveStory = function(){
        console.log('saving story');
        var data = {
                story: scope.storyText
            };
        return $http.post('/api/members/story', data)
                    .then( result => {
                      console.log('saved story')
                      return $state.go('stories')
                    })
      }
      scope.lookupSuggestions = function(e){
        // console.debug(scope);
        scope.storyArray = JSON.stringify(getStoryArray(scope.storyText));
        let lastWord = scope.storyArray[scope.storyArray.length-1]
        if(event.keyCode === 32 || event.charCode === 32) {
          scope.wordTreeSuggestionsOne = "";
          scope.wordTreeSuggestionsTwo = "";
          scope.wordTreeSuggestionsThree = "";

          wordTree(10, lastWord, 'One')
          wordTree(10, lastWord, 'Two')
          wordTree(10, lastWord, 'Three')
        }
        $http.get('/api/v1/ngram/bigram/' + scope.storyArray[scope.storyArray.length-1])
             .then( response => {
               let suggestions = response.data.map( bigram => bigram.tokens[1].word)
               scope.suggestions = suggestions.join(", ");
             })
             .catch( err => {
               scope.suggestionError = err;
             })
      }
    },
    template: `
    <div class="container">
      <div class="row">
        <div class="col-md-12" class="write-block-container">
          <h1>Title: <span contenteditable>Green Eggs and Ham</span></h1>
          <h2>Author: <span contenteditable>Dr. Seuss</span></h2>

          <blockquote class="blockquote-reverse">
            <input ng-keypress="lookupSuggestions($event)"  class="form-control write-block" ng-model="storyText" placeholder="once upon a time..." >
            </input>
            <footer class="typeahead" ng-hide="showWordTree == true">
              <cite title="Suggestions:">Suggestions:</cite><br> <span ng-bind="wordTreeSuggestionsOne">time, dream, midnight</span>
              <br><span ng-bind="wordTreeSuggestionsTwo">time, dream, midnight</span><br>
              <span ng-bind="wordTreeSuggestionsThree">time, dream, midnight</span>
            </footer>
            <div ng-bind="suggestionError" ng-show="showSuggestions == true" class="has-error"></div>
          </blockquote>
          <pre ng-bind="suggestions" ng-show="showSuggestions == true"></pre>
          <label>Your Story:</label>
          <div contenteditable ng-bind="storyText"</div>
        </div>
      </div>
      <div style="position:fixed; bottom:0px;">
        <label>
          Hide suggestions?
          <input type="checkbox" class="checkbox.inline" ng-model="showWordTree"/>
        </label>
        <label>
          Hint: Don't like what you see? Press backspace then space.
        </label>
        <login></login>
      </div>
    </div>
    `
  }
})
