
/**
 * @name search-bar
 * @type {directive}
 * @memberof directives
 * @summary The search-bar directive can be placed on any page or in the navbar, and searches songs for similar titles.
 * @controller Typeahead Controller
 * @templates: [directive definition, typeahead-template.html]
 * @requires ui-bootstrap
 * @requires app.controller.TypeaheadCtrl
 */
app.directive( 'searchBar', function ( $rootScope, AuthService, AUTH_EVENTS, $state ) {
  return {
    controller: 'TypeaheadCtrl',
    template: searchBarTemplate
  };
} );

/**
 * @name app.controller.TypeaheadCtrl
 * @description controller used for typeahead directives.
 */
app.controller( 'TypeaheadCtrl', function ( $scope, $http, $state, $rootScope ) {

  var _selected;

/**
 * @name search-bar.scope.getSongs
 * @description getSongs is on the typeahead controller scope and sends a query to the search route
 * @type function
 * @fires request.get ['/api/v1/songs/s']
 * @param  {String} searchQuery [title string to search]
 * @return {Object[]}             [an array of song objects]
 */
  $scope.getSongs = function ( searchQuery ) {
    let config = {
      params: {
        where: {
          title: {
            like: '%' + searchQuery + '%'
          }
        }
      }
    };
    return searchQuery ? $http.get( '/api/v1/songs/s', config )
      .then( response => response.data ) : new Promise(resolve => resolve([]));
  };

/**
 * @name app.controller.TypeaheadCtrl.scope.updateSongs
 * @type function
 * @description this function is fired by interaction with the DOM. It fires the getSongs method, the sets $scope.songs to the resulting array.
 * @fires app.controller.TypeaheadCtrl.scope.getSongs
 * @param  {Object} customSelected [description]
 * @return {undefined}                [description]
 */
  $scope.updateSongs = function ( customSelected ) {
    $scope.getSongs( customSelected )
      .then( songs => $scope.songs = songs );
  };

  $scope.ngModelOptionsSelected = function ( value ) {
    if ( arguments.length ) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };

/**
 * @name app.controller.TypeaheadCtrl.scope.selectOption
 * @type function
 * @description selectOption defines the behavior after an option is selected in the TypeAheadCtrl dropdown.
 */
  $scope.selectOption = function ( item, model, label ) {
    $state.go( 'oneSong', {
      songId: item.id
    } );
  };
} );

/**
 * @name app.directive.search-bar.template
 * @typedef htmlTemplate
 * @type {htmlTemplate}
 */
let searchBarTemplate = `
        <div class="input-group">
            <input
              type="text"
              ng-model="queryString"
              placeholder="...search for a song"
              uib-typeahead="song as song.title for song in songs"
              typeahead-on-select="selectOption($item, $model, $label)"
              typeahead-template-url="/js/common/directives/search-bar/typeahead-template.html" class="form-control" typeahead-show-hint="true"
              typeahead-min-length="0"
              ng-keyUp = "updateSongs(queryString)" >
            </input>
            <span class="input-group-btn">
            </span>
        </div>
`;
