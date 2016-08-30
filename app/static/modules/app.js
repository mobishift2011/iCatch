adminApp = angular.module('app', [
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap.pagination',
    'overviewCtrls',
    'threatsCtrls',
    'investigateCtrls',
    'computerCtrls',
    'settingsCtrls',

    'alarmServices',
    'computerServices',
])
    .constant('sys', {
        'API': '/api'
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
                .state('investigate_file', {
                    url: '/investigates/file',
                    views: {
                        'investigate': {
                            templateUrl: '/static/modules/templates/investigate-file.html',
                            controllers: 'investigate_file'
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
    .directive('panel', ['$filter', function ($filter) {
        return {
            restrict: 'EA',
            // replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/panel.html',
            link: function ($scope, $element, $attrs) {
                $element.find('.panel-title').find('.panelTitle').html($filter('translate')($attrs.title));
                $element.find('.panel-title').find('.panelIcon').attr('class', $attrs.icon);
            }
        }
    }])
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
    .directive('alarmTable', function () {
        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            templateUrl: '/static/modules/templates/directives/alarm-table.html',
            link: function ($scope, $element, $attrs) {
                $scope.alarms = $scope[$attrs.datasource];
                $scope.alarmStyle = {
                    'new': 'warning',
                    'unsolved': 'danger',
                    'solved': 'default',
                    'except': 'primary',
                    'exception': 'primary',
                    'whitelist': 'success'
                };
            }
        }
    })
    .directive('computerTable', ['Computer',
        function (Computer) {
            return {
                restrict: 'C',
                replace: true,
                transclude: true,
                templateUrl: '/static/modules/templates/directives/computer-table.html',
                link: function ($scope, $element, $attrs) {
                    $scope.$watch($attrs.datasource, function (newValue, oldValue, scope) {
                        $scope.data = newValue;
                    });

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

                    $scope.clickCom = function (item) {
                        $scope.computer = item;
                    };

                    $scope.uninstallSensor = function () {
                        var computer_ids = [];
                        if (confirm('Are you sure to uninstall sensor ?')) {
                            $scope.data.map(function (e) {
                                if (e.checked) {
                                    computer_ids.push(e.id)
                                    //e.status = 'uninstall';
                                }
                            });

                            if(computer_ids.length) {
                                Computer.uninstall({ids: computer_ids.join(',')}, function(data) {
                                    if(data.status == true){
                                        ht.noty('Sensor is uninstalling');
                                    }else{
                                        ht.noty('Sensor uninstall failed');
                                    }
                                });
                            }
                        }
                    };

                    Computer.sensorList(function (data) {
                        $scope.sensors = data;
                    });

                    Computer.sensorList({upgrade: true}, function (data) {
                        $scope.sensorPackages = data;
                    });

                    $scope.addProfile = function (item) {
                        $('#addProfileModal').modal('hide');
                        if (confirm('Are you sure to change profile ?')) {
                            var ids = [];
                            $scope.data.map(function (e) {
                                if (e.checked) {
                                    ids.push(e.id)
                                }
                            });

                            Computer.addProfile({ids: ids, profileId: item.id}, function(data){
                                if(data.status == true){
                                    ht.noty('Sensor is updating');
                                }else{
                                    ht.noty('Sensor updated failed');
                                }
                            });
                        }
                    };

                    $scope.upgradeSensor = function (item) {
                        $('#upgradeSensorModal').modal('hide');
                        if (confirm('Are you sure to upgrade sensor ?')) {
                            var ids = [];
                            $scope.data.map(function (e) {
                                if (e.checked) {
                                    ids.push(e.id)
                                }
                            });

                            Computer.upgrade({ids: ids, sensor: item}, function(data){
                                if(data.status == true){
                                    ht.noty('Sensor is upgrading');
                                }else{
                                    ht.noty('Sensor upgraded failed');
                                }
                            });
                        }
                    };
                }
            }
        }])
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
    .directive('comModal', ['$timeout', '$filter', 'Computer',
        function ($timeout, $filter, Computer) {
            return {
                restrict: 'C',
                replace: true,
                templateUrl: '/static/modules/templates/directives/computer-modal.html',
                link: function ($scope, $element, $attrs) {
                    $scope.computer = $scope[$attrs.datasource];
                    $timeout(function () {
                        $('.iphone-toggle').iphoneStyle();
                    }, 2000)

                    var _statusOps = [
                        {text: 'Resume', value: 'on'},
                        {text: 'Pause', value: 'pause'}
                    ];

                    $scope.statusOps = {
                        'on': _statusOps,
                        'pause': _statusOps
                    };

                    $scope.changeStatus = function (status, id) {
                        Computer[status]({ids: id}, function(data){
                            $scope.computer.status = status;
                            ht.noty($filter('translate')('Updating computer status'));
                        });
                    };
                }
            }
        }])
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

        $scope.isNotified = false;
    }])
    .controller('notificationCtrl', ['$scope', function ($scope, $stateParams) {
        $scope.notifications = [
            // {'title': 'this is just a test', 'date': '1987-7-15 12:23:45', 'is_read': true},
        ];

        if($scope.notifications.length) {
            $scope.isNotified = true;
        }

        $scope.readNotification = function (item) {
            item.is_read = true;
            //todo
        };
    }])
;