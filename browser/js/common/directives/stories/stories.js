

app.directive('stories', function($http, $rootScope){
  return {
    link: function(scope, element, attrs){
      scope.loadStory = function(story){
        console.log('loading story', story);
        $rootScope.storyText = story;
      }
      console.log(scope)
    }
  }
});

app.config(function ($stateProvider) {

    $stateProvider.state('stories', {
        url: '/stories',
        templateUrl: 'js/common/directives/stories/stories.html',
        controller: 'StoriesCtrl'
    });

});


app.controller('StoriesCtrl', function ($scope, AuthService, $state, $http, $rootScope) {
  // $scope.stories = [];
  function getStories(){
    console.log('getting story');
    $http.get('/api/members/stories').then( response => {
      console.log('got stories', response.data);
      return $scope.stories = response.data;
    })
  }
  getStories();
  // $scope.getStories = getStories;
})
