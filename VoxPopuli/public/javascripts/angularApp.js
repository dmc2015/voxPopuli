var app = angular.module('VoxPopuli', ['ui.router']);


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})//;
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});
		$urlRouterProvider.otherwise('home');
}]);

app.factory('posts', [function(){
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
				$scope.posts.push({
					title: $scope.title,
					link: $scope.link,
					upvotes:0,
					downvotes:0,
					comments: [
						// {author: 'Dave', body: 'Well said', upvotes: 0},
						// {author: 'Bill Bob', body: 'You lie', upvotes: 1}
					]
				});
				$scope.title="";
				$scope.link="";
			};


			$scope.incrementUpvotes = function(post){
				post.upvotes +=1;
			};

			$scope.incrementDownvotes = function(post){
				post.downvotes +=1;
			};
}])//;

app.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){
		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function(){
			if ($scope.body === '') {return; }
			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0,
				downvotes: 0
			});
			$scope.body = '';
		};


}]);