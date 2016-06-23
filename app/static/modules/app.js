adminApp = angular.module('app', [
    'ui.router',
    'overviewCtrls',
    'threatsCtrls',
    'investigateCtrls',
    'computerCtrls',
    'settingsCtrls',
])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.comStatStyle = {
            'on': 'success',
            'pause': 'primary',
            'resume': 'warning',
            'off': 'default',
            'uninstall': 'danger',
        };
    }])
    .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false,
        });
        $stateProvider
            .state('investigate_computer', {
                url: '/investigates/computer',
                views: {
                    'investigate': {
                        templateUrl: '/static/modules/templates/investigate-computer.html',
                        controllers: 'investigate_computer'
                    }
                }
            })
            .state('investigate_ip', {
                url: '/investigates/ip',
                views: {
                    'investigate': {
                        templateUrl: '/static/modules/templates/investigate-ip.html',
                        controllers: 'investigate_ip'
                    }
                }
            })
            .state('investigate_user', {
                url: '/investigates/user',
                views: {
                    'investigate': {
                        templateUrl: '/static/modules/templates/investigate-user.html',
                        controllers: 'investigate_user'
                    }
                }
            })
            .state('investigate_ioc', {
                url: '/investigates/ioc',
                views: {
                    'investigate': {
                        templateUrl: '/static/modules/templates/investigate-ioc.html',
                        controllers: 'investigate_ioc'
                    }
                }
            })

            .state('settings_basic', {
                url: '/settings/basic',
                views: {
                    'settings': {
                        templateUrl: '/static/modules/templates/settings-basic.html',
                        controllers: 'settings_basic'
                    }
                }
            })
            .state('settings_user', {
                url: '/settings/user',
                views: {
                    'settings': {
                        templateUrl: '/static/modules/templates/settings-user.html',
                        controllers: 'settings_user'
                    }
                }
            })
            .state('settings_profile', {
                url: '/settings/profile',
                views: {
                    'settings': {
                        templateUrl: '/static/modules/templates/settings-profile.html',
                        controllers: 'settings_profile'
                    }
                }
            })
            .state('settings_group', {
                url: '/settings/group',
                views: {
                    'settings': {
                        templateUrl: '/static/modules/templates/settings-group.html',
                        controllers: 'settings_group'
                    }
                }
            })
        ;
    }])
    .directive('sidebar', function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/static/modules/templates/sidebar.html',
            link: function ($scope) {
                $scope.selectSidebar = function (title) {
                    $scope.selectedSidebarItem = title;
                };
            }
        }
    })
    .directive('panel', function () {
        return {
            restrict: 'EA',
            // replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/panel.html',
            link: function ($scope, $element, $attrs) {
                $element.find('.panel-title').find('span').html($attrs.title);
            }
        }
    })
    .controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.navs = [
            {'title': 'Overview', 'url': '/overview/', 'icon': 'glyphicon-cog'},
            {'title': 'Threats', 'url': '/threats/', 'icon': 'glyphicon-cog'},
            {'title': 'Security Investigates', 'url': '/investigates/', 'icon': 'glyphicon-cog'},
            {'title': 'Computer', 'url': '/computers/', 'icon': 'glyphicon-cog'},
            {'title': 'Settings', 'url': '/settings/', 'icon': 'glyphicon-cog'},
        ];
        (function (title) {
            for (var i in $scope.navs) {
                nav = $scope.navs[i];
                if (nav.url === location.pathname) {
                    $scope.selectedNavTitle = nav.title;
                    break
                }
            }
        })();
        $scope.notifications = [
            {'content': 'this is just a test', 'date': '1987-7-15 12:23:45'},
            {'content': 'this is just a test', 'date': '1987-7-15 12:23:45'},
        ];

    }])
;