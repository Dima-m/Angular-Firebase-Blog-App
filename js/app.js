const blog = angular.module('blog', ['ngRoute', 'firebase']);

blog.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'EntryCtrl'
    }).when('/blog/:blogID', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

blog.factory('blogs', function($firebaseArray, $firebaseObject) {
    var URL = 'https://resplendent-torch-6216.firebaseio.com';
    var listBlogs = new Firebase(URL);
    return {
        listBlogs: $firebaseArray(listBlogs),
        singleBlog: function(blogID) {
            return $firebaseObject(listBlogs.child(blogID));
        },
        addBlog: function(title, entry, date) {
            var createdOn = Date.now();
            this.listBlogs.$add({
                title: title,
                entry: entry,
                date: createdOn
            });
        },
        saveBlog: function(blog, title, entry, date) {
            blog.$save({
                title: title,
                entry: entry,
                date: createdOn
            });
        }
    };
});

blog.directive('viewBlog', function() {
    return {
        restrict: 'E',
        bindToController: true,
        scope: {},
        controller: 'BlogCtrl',
        controllerAs: 'view',
        templateUrl: 'partials/viewBlog.html'
    };
});

blog.directive('enterBlog', function() {
    return {
        restrict: 'E',
        scope: {},
        bindToController: true,
        controller: "EntryCtrl",
        controllerAs: 'entry',
        templateUrl: 'partials/enterBlog.html'
    };
});

blog.directive('blogList', function() {
    return {
        restrict: 'E',
        scope: {},
        bindToController: true,
        controller: 'ListCtrl',
        controllerAs: 'list',
        templateUrl: 'partials/blogList.html'
    };
});

blog.controller('ListCtrl', function(blogs) {
    this.blogs = blogs.listBlogs;
});

blog.controller('EntryCtrl', function(blogs) {
    this.saveBlog = function() {
        blogs.addBlog(this.blog.title, this.blog.entry);
        this.blog.title = '';
        this.blog.entry = '';
    }.bind(this);
});

blog.controller('BlogCtrl', function($routeParams, blogs) {
    this.blog = blogs.singleBlog($routeParams.blogID);
});
