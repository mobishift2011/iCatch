adminApp = angular.module('app', [
        'ui.router',
        'overviewCtrls',
        'threatsCtrls',
        'investigateCtrls',
        'settingsCtrls',
    ])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.notifications = [
            {'content': 'this is just a test', 'date': '1987-7-15 12:23:45'},
            {'content': 'this is just a test', 'date': '1987-7-15 12:23:45'},
        ]
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
        ;
    }]);