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
            .state('threatsFile', {
                params: {id: null},
                url: '/threats/file',
                views: {
                    'threats': {
                        templateUrl: '/static/modules/templates/threats-file.html',
                        controllers: 'threats_file'
                    }
                }
            })
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

            .state('computers_protected', {
                url: '/computers/protected',
                views: {
                    'computerList': {
                        template: '<div class="computer-table" datasource="coms" ng-controller="protectedComs"></div>',
                        controllers: 'protectedComs'
                    }
                }
            })
            .state('computers_isolated', {
                url: '/computers/isolated',
                views: {
                    'computerList': {
                        template: '<div class="computer-table" datasource="coms" ng-controller="isolatedComs"></div>',
                        controllers: 'isolatedComs'
                    }
                }
            })
            .state('computer_detail', {
                params: {id: null},
                url: '/computer',
                views: {
                    'computer': {
                        templateUrl: '/static/modules/templates/computer-detail.html',
                        controllers: 'computerDetail'
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
            templateUrl: '/static/modules/templates/directives/sidebar.html',
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
            templateUrl: '/static/modules/templates/directives/panel.html',
            link: function ($scope, $element, $attrs) {
                $element.find('.panel-title').find('span').html($attrs.title);
            }
        }
    })
    .directive('modal', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/modal.html',
            link: function ($scope, $element, $attrs) {
                $element.attr('id', $attrs.id);
                $element.attr('aria-labelledby', $attrs.title);
                $element.find('.modal-title').html($attrs.title);
                $scope.saveModal = $scope[$attrs.save];
                $scope.modalFooter = !!parseInt($attrs.footer)
            }

        }
    })
    .directive('computerTable', function () {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/computer-table.html',
            link: function ($scope, $element, $attrs) {
                $scope.data = $scope[$attrs.datasource];
            }
        }
    })
    .directive('navbtn', function () {
        return {
            restrict: 'C',
            replace: true,
            templateUrl: '/static/modules/templates/directives/navbtn.html',
            link: function ($scope, $element, $attrs) {
                $scope.tabs = $scope[$attrs.datasource];

                $scope.selectedTab = $attrs.selectedindex !== undefined ?
                    $scope.tabs[parseInt($attrs.selectedindex)].title : null;

                $scope.selectTab = function (title) {
                    $scope.selectedTab = title;
                }
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