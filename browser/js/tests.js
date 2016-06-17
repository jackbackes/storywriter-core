
app.config(function($stateProvider){
  $stateProvider.state('searchBarTest', {
    url: 'test/search-bar',
    template: '<br><br><br><br><search-bar></search-bar>'
  })
})
app.config(function($stateProvider){
  $stateProvider.state('storyWriterTest', {
    url: '/story-writer-test',
    template: '<br><br><br><br><story-writer></story-writer>'
  })
})
