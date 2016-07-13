adminApp = angular.module('app', [
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap.pagination',
    'overviewCtrls',
    'threatsCtrls',
    'investigateCtrls',
    'computerCtrls',
    'settingsCtrls',
])
    .constant('sys', {
        'API': 'http://localhost:9090/api'
    })
    .run(['$rootScope', function ($rootScope) {
        $rootScope.comStatStyle = {
            'on': 'success',
            'pause': 'primary',
            'resume': 'warning',
            'off': 'default',
            'uninstall': 'danger',
        };
    }])

    .config(['$stateProvider', '$locationProvider', '$resourceProvider', '$translateProvider',
        function ($stateProvider, $locationProvider, $resourceProvider, $translateProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
                rewriteLinks: false,
            });

            $resourceProvider.defaults.stripTrailingSlashes = false;

            $translateProvider.preferredLanguage('cn');
            $translateProvider.useStaticFilesLoader({
                prefix: '/static/translates/',
                suffix: '.json'
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
                .state('threatsAction', {
                    params: {id: null},
                    url: '/threats/actioin',
                    views: {
                        'threats': {
                            templateUrl: '/static/modules/templates/threats-action.html',
                            controllers: 'threats_action'
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
                .state('settings_email', {
                    url: '/settings/email',
                    views: {
                        'settings': {
                            templateUrl: '/static/modules/templates/settings-email.html',
                            controllers: 'settings_email'
                        }
                    }
                })
        }
    ])
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
                $element.find('.panel-title').find('.panelTitle').html($attrs.title);
                $element.find('.panel-title').find('.panelIcon').attr('class', $attrs.icon);
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
    .directive('alertTable', function () {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/alert-table.html',
            link: function ($scope, $element, $attrs) {
                $scope.alerts = $scope[$attrs.datasource];
                $scope.alertStyle = {
                    'new': 'warning',
                    'unsolved': 'danger',
                    'solved': 'success',
                    'except': 'primary',
                    'exception': 'primary',
                    'whitelist': 'success'
                };

                $scope.changeAlertStatus = changeAlertStatus;
                $scope.exceptAlert = exceptAlert;

                function changeAlertStatus(alert) {
                    if (alert.status === 'exception') {
                        removeExcept(alert);
                        return
                    }

                    process = ['new', 'unsolved', 'solved'];

                    for (var i = 0; i <= (process.length - 1); i++) {
                        if (alert.status === process[i] && i < (process.length - 1)) {
                            var nextStatus = process[i + 1];
                            alert.status = nextStatus;

                            // if (nextStatus === 'solved') {
                            //     $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                            // }

                            break
                        }
                    }
                }

                function exceptAlert(alert) {
                    if (alert.type.toLowerCase() === 'action') {
                        alert.status = 'exception';
                        // $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                    }
                }

                function removeExcept(alert) {
                    alert.status = 'unsolved';
                    // $scope.historyAlerts.splice($scope.historyAlerts.indexOf(alert), 1);
                }
            }
        }
    })
    .directive('computerTable', function () {
        return {
            restrict: 'C',
            replace: true,
            scope: false,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/computer-table.html',
            link: function ($scope, $element, $attrs) {
                $scope.data = $scope[$attrs.datasource];

                $scope.checkAll = function (checked) {
                    $scope.data.map(function (e) {
                        e.checked = checked;
                    })
                };
                $scope.check = function () {
                    $scope.selectAll = true;
                    for (var i in $scope.data) {
                        checked = $scope.data[i].checked;
                        if (!checked) {
                            $scope.selectAll = false;
                            break;
                        }
                    }
                };
                $scope.uninstallSensor = function () {
                    if (confirm('Are you sure to uninstall sensor ?')) {
                        $scope.data.map(function (e) {
                            if (e.checked) {
                                e.status = 'uninstall';
                            }
                        })
                    }
                }

                $scope.profiles = [
                    {name: 'profile1'},
                    {name: 'profile3'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                    {name: 'profile2'},
                ];

                $scope.sensor = $scope.profiles;

                $scope.addProfile = function (item) {
                    $('#addProfileModal').modal('hide');
                    if (confirm('Are you sure to change profile ?')) {
                        alert(item.name);
                        $scope.data.map(function (e) {
                            if (e.checked) {
                                alert(e.name);
                            }
                        })
                    }
                };

                $scope.upgradeSensor = function (item) {
                    $('#upgradeSensorModal').modal('hide');
                    if (confirm('Are you sure to upgrade sensor ?')) {
                        alert(item.name);
                        $scope.data.map(function (e) {
                            if (e.checked) {
                                alert(e.name);
                            }
                        })
                    }
                };
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
            {'title': 'Overview', 'url': '/overview/', 'icon': 'glyphicon glyphicon-stats'},
            {'title': 'Threats', 'url': '/threats/', 'icon': 'glyphicon glyphicon-exclamation-sign'},
            {'title': 'Security Investigates', 'url': '/investigates/', 'icon': 'glyphicon glyphicon-search'},
            {'title': 'Computer', 'url': '/computers/', 'icon': 'iconfont icon-computer'},
            {'title': 'Settings', 'url': '/settings/', 'icon': 'glyphicon glyphicon-cog'},
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

        $scope.isNotified = true;
    }])
    .controller('notificationCtrl', ['$scope', function($scope, $stateParams){
            $scope.notifications = [
                {'title': 'this is just a test', 'date': '1987-7-15 12:23:45', 'is_read': true},
                {'title': 'hahahaha', 'date': '1987-7-15 12:23:45', 'is_read': false},
                {'title': 'Cras justo odio', 'date': '1987-7-15 12:23:45'},
                {'title': 'Dapibus ac facilisis in', 'date': '1987-7-15 12:23:45'},
                {'title': 'Morbi leo risus', 'date': '1987-7-15 12:23:45'},
                {'title': 'Porta ac consectetur ac', 'date': '1987-7-15 12:23:45'},
                {'title': 'Vestibulum at eros', 'date': '1987-7-15 12:23:45'},
            ];

            $scope.isNotified = true;

            $scope.readNotification = function(item) {
                item.is_read = true;
                //todo
            };
    }])
;