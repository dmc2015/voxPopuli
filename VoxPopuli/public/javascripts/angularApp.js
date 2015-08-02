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
		});
		$urlRouterProvider.otherwise('home');
	}]);

	app.factory('posts', ['$http', function($http){
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
			return $http.post('/posts', post).success(function(data){
				postobject.posts.push(data);
			});
		};

		postobject.upvote = function(post){
			return $http.put('/posts/' + post._id + '/upvote').success(function(datat){
				post.upvotes += 1;
			});
		};

		postobject.addComment = function(id, comment){
			return $http.post('/posts/' + id + '/comments', comment);
		};

		postobject.upvoteComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function(data){
				comment.upvotes += 1;
			});
		};

		return postobject;
	}]);

	app.controller('MainCtrl', [
		'$scope',
		'posts',
		'$stateParams',
		function($scope, posts){
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
				function($scope, posts, post){
					// $scope.post = posts.posts[$stateParams.id];old version that does not show the actual post when viewing the post
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
