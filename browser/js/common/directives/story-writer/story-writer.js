app.directive('storyWriter', function(){
  return {
    template: `
    <div class="container">
      <div class="row">
        <div class="col-md-12" class="write-block-container">
          <pre>{scope: scope goes here}</pre>
          <blockquote class="blockquote-reverse">
            <div contenteditable="true" class="write-block">
              Once upon a
            </div>
            <footer class="typeahead">
              <cite title="Suggestions:">Suggestions:</cite> time, dream, midnight
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
    `
  }
})

app.controller('storyWriterCtrl', function($scope){

})

let storyWriterTemplate = `
<div class="container">
  <div class="row">
    <div class="col-md-12" class="write-block-container">
      <pre>{scope: scope goes here}</pre>
      <blockquote class="blockquote-reverse">
        <div contentiseditable="true" class="write-block">
          Text goes here...
        </div>
        <footer class="typeahead">
          <cite title="Suggestions:">Suggestions</cite> go here.
        </footer>
      </blockquote>
    </div>
  </div>
</div>
`
