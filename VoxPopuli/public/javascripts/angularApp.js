var app = angular.module('VoxPopuli', ['ui.router']);


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts ) {
					return posts.getAll();
				}]
			}
		})//;
		.state('posts', {
			url: '/posts/:id',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'posts', function($stateParams, posts){
					return posts.get($stateParams.id);
				}]
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth) {
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		});
		$urlRouterProvider.otherwise('home');
	}]);

	app.factory('auth', ['$http', '$window', function(http, $window) {
		var auth = {};

		auth.saveToken = function(token){
			$window.localStorage['VoxPopuli-news-token'] = token;
		}

		auth.getToken = function(token){
			return $window.localStorage['VoxPopuli'];
		}

		auth.isLoggedIn = function() {
			var token = auth.getToken();

			if (token){
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now() /1000;
			} else {
				return false;
			}
		}

		auth.currentUser = function() {
			if(auth.isLoggedIn()) {
				var token = auth.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload.username;
			}
		}

		auth.register = function(user) {
			return $http('/register', user).success(function(data){
				auth.saveToken(data.token);
			});
		}

		auth.logIn = function(user) {
			return $http('/login', user).success(function(data){
				auth.saveToken(data.token);
			});
		}

		auth.logOut = function() {
			$window.localStorage.removeItem('VoxPopuli-news-token')
		}

		return auth

	}]);

	app.factory('posts', ['$http', auth,  function($http, auth){
		//the body of a service
		var postobject = {
			posts: [

			]
			// posts: [
			// 	{title: 'post 1', upvotes:2, downvotes:1, comments: ''},
			// 	{title: 'post 2', upvotes:1, downvotes:1},
			// 	{title: 'post 3', upvotes:5, downvotes:1},
			// 	{title: 'post 4', upvotes:4, downvotes:1},
			// 	{title: 'post 5', upvotes:11, downvotes:1}
			// ]
		};
		postobject.getAll = function(){
			return $http.get('/posts').success(function(data){
				angular.copy(data, postobject.posts);
			});
		};

		postobject.get = function(id) {
			return $http.get('/posts/' + id).then(function(res) {
				return res.data;
			});
		};

		postobject.create = function(post){
			return $http.post('/posts', post, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				postobject.posts.push(data);
			});
		};

		postobject.upvote = function(post){
			return $http.put('/posts/' + post._id + '/upvote', null, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				post.upvotes += 1;
			});
		};

		postobject.addComment = function(id, comment){
			return $http.post('/posts/' + id + '/comments', comment, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			});
		};

		postobject.upvoteComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				comment.upvotes += 1;
			});
		};

		return postobject;
	}]);

	app.controlller('AuthCtrl', [
		'$scope',
		'$state',
		'auth',
		function($scope, $state, auth) {
			$scope.user = {};

			$scope.register = function(){
				auth.register($scope.user).error(function(error){
					$scope.error = error;
				}).then(function() {
					$state.go('home');
				});
			};

			$scope.logIn = function() {
				auth.logIn($scope.user).error(function(errir){
					$scope.error = error;
				}).then(function() {
					$state.go('home');
				});
			};
		]);

		app.controller('MainCtrl', [
			'$scope',
			'posts',
			'auth',
			'$stateParams',
			function($scope, posts, auth){
				$scope.isLoggedIn = auth.isLoggedIn;
				$scope.test = 'Hello world!';
				$scope.posts = posts.posts;/*[
					{title: 'post 1', upvotes:2},
					{title: 'post 2', upvotes:1},
					{title: 'post 3', upvotes:5},
					{title: 'post 4', upvotes:4},
					{title: 'post 5', upvotes:11}
				];*/

				$scope.addPost = function(){
					if(!$scope.title || $scope.title === "") {return;}
					// $scope.posts.push({  NON-PERSISTENT VERSION
					posts.create({ //PERSISTENT VERSTION
						title: $scope.title,
						link: $scope.link,

						// upvotes:0,
						// downvotes:0,
						// comments: [
						// 	// {author: 'Dave', body: 'Well said', upvotes: 0},
						// 	// {author: 'Bill Bob', body: 'You lie', upvotes: 1}
						//]
					});
					$scope.title="";
					$scope.link="";
				};


				$scope.incrementUpvotes = function(post){
					// post.upvotes +=1; NON-PERSISTENT
					posts.upvote(post); //PERSISTENT
				};

				$scope.incrementDownvotes = function(post){
					post.downvotes +=1;
				};
			}])//;

			app.controller('PostsCtrl', [
				'$scope',
				'posts',
				'post',
				'auth',
				function($scope, posts, post, auth){
					// $scope.post = posts.posts[$stateParams.id];old version that does not show the actual post when viewing the post
					$scope.isLoggedIn = auth.isLoggedIn;
					$scope.post = post;

					$scope.addComment = function(){
						if ($scope.body === '') {return; }
						posts.addComment(post._id, {
							body: $scope.body,
							author: 'user',
						}).success(function(comment){
							$scope.post.comments.push(comment);
						});
						// upvotes: 0,
						// downvotes: 0
						$scope.body = '';
					};
					$scope.incrementUpvotes = function(comment) {
						posts.upvoteComment(post, comment);
					};

				}]);

				app.controller('NavCtrl', [
					'$scope',
					'auth',
					function($scope, auth) {
						$scope.isLoggedIn = auth.isLoggedIn;
						$scope.currentUser = auth.currentUser;
						$scope.logOut = auth.logOut;
					}]);
