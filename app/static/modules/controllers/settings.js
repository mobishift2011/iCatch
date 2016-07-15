angular.module('settingsCtrls', ['userServices', 'configServices', 'profileServices'])
    .controller('settings', ['$scope', '$state', function ($scope, $state) {
        $scope.sidebar = {
            title: 'Settings',
            items: [
                {title: 'Basic Settings', state: 'settings_basic', icon: 'glyphicon glyphicon-home'},
                {title: 'Users Management', state: 'settings_user', icon: 'glyphicon glyphicon-user'},
                {title: 'Profiles Management', state: 'settings_profile', icon: 'glyphicon glyphicon-file'},
                {title: 'Groups Management', state: 'settings_group', icon: 'glyphicon glyphicon-folder-close'},
                {title: 'Email Notification', state: 'settings_email', icon: 'glyphicon glyphicon-envelope'}
            ]
        }
        $state.go('settings_basic');
    }])

    .controller('settings_basic', ['$scope', '$filter', 'Config', 'Profile',
        function ($scope, $filter, Config, Profile) {
            $scope.configs = {
                timezone: {},
                profile: {},
                fileHash: {},
                quarantineMessage: {},
                quarantineWhitelist: {}
            }

            var configTitles = Object.keys($scope.configs);
            for (var i in configTitles) {
                var title = configTitles[i];
                (function(title) {
                    Config.get(title, function (data) {
                        if (data) {
                            $scope.configs[title] = data;
                        }
                    });
                })(title);

            };

            $scope.tzs = [
                'America/Los Angelos',
                'Chinese/Beijing',
            ];

            Profile.get(function(data){
                $scope.profiles = data.objects || [];
            });

            $scope.fileHashs = [
                {title: 'MD5', value: 'md5'},
                {title: 'SHA256 & MD5', value: 'sha256_and_md5'},
            ];

            var tzBtnText = 'Change Timezone'
            var profileBtnText = 'Change Profile'
            var confirmBtnText = 'Confirm';

            $scope.tzBtnText = tzBtnText;
            $scope.profileBtnText = profileBtnText;

            $scope.clickChangeZone = function () {
                if ($scope.isChangeZone) {
                    Config.add($scope.configs.timezone, function (data) {
                        $scope.configs.timezone = data;
                        ht.noty($filter('translate')('Update successfully') + ' !');
                    });
                }
                $scope.tzBtnText = ($scope.tzBtnText === tzBtnText) ? confirmBtnText : tzBtnText;
                $scope.isChangeZone = !$scope.isChangeZone;
            };

            $scope.clickChangeProfile = function () {
                if ($scope.isChangeProfile) {
                    Config.add($scope.configs.profile, function (data) {
                        $scope.configs.profile = data;
                        ht.noty($filter('translate')('Update successfully') + ' !')
                    });
                }
                $scope.profileBtnText = ($scope.profileBtnText === profileBtnText) ? confirmBtnText : profileBtnText;
                $scope.isChangeProfile = !$scope.isChangeProfile;
            };

            $scope.changeAlgorithm = function () {
                Config.add($scope.configs.fileHash, function (data) {
                    $scope.configs.fileHash = data;
                    ht.noty($filter('translate')('Update successfully') + ' !')
                });
            };

            $scope.saveQuarantineMessage = function () {
                Config.add($scope.configs.quarantineMessage, function (data) {
                    $scope.configs.quarantineMessage = data;
                    ht.noty($filter('translate')('Update successfully') + ' !')
                });
            };

            $scope.saveQuarantineWhitelist = function () {
                Config.add($scope.configs.quarantineWhitelist, function (data) {
                    $scope.configs.quarantineWhitelist = data;
                    ht.noty($filter('translate')('Update successfully') + ' !')
                });
            };
        }
    ])

    .controller('settings_user', ['$scope', 'User',
        function ($scope, User) {
            $scope.userFormData = {admin: 0};

            $scope.checkAll = function () {
                for (var i in $scope.users) {
                    $scope.users[i].toRemove = $scope.toRemoveAll;
                }
            };

            function getUserList(data) {
                $scope.pagination = data.meta;
                $scope.users = data.objects;
            }

            $scope.users = User.list({}, getUserList);
            $scope.pageChanged = function (page) {
                User.list({page: page}, getUserList);
            };

            $scope.addUser = function () {
                var userData = $scope.userFormData
                User.add(userData, function (result) {
                    if (result.status) {
                        $scope.users.unshift(result.data);
                        ht.noty('Add user ' + result.data.username + ' successfully' + '!')
                    } else {
                        ht.noty(result.message);
                    }
                });
            };

            $scope.removeUsers = function () {
                if (confirm('Are you sure to delete?')) {
                    this.toRemoveAll = false;
                    for (var i = ($scope.users.length - 1); i >= 0; i--) {
                        if ($scope.users[i].toRemove) {
                            $scope.users.splice(i, 1);
                        }
                    }
                }
            };
        }
    ])

    .controller('settings_profile', ['$scope', '$filter', 'Profile',
        function ($scope, $filter, Profile) {
            $scope.profileFormData = {};

            function getProfileList(data) {
                $scope.pagination = data.meta;
                $scope.profiles = data.objects;
            }

            Profile.list(getProfileList);

            $scope.pageChanged = function (page) {
                Profile.list({page: page}, getProfileList);
            };

            $scope.addProfile = function () {
                // if (!$scope.profileFormData.originpath) {
                //     console.log('no file');
                //     return;
                // }
                Profile.add($scope.profileFormData, function (result) {
                    console.log(result);
                    if (result.status) {
                        ht.noty($filter('translate')('Save Successfully') + '!');
                        Profile.list({page: $scope.pagination.page}, getProfileList);
                    } else {
                        ht.noty($filter('translate')(result.message));
                    }

                });
            };

            $scope.checkAll = function () {
                var that = this;
                angular.forEach($scope.profiles, function (e) {
                    e.toRemove = that.toRemoveAll;
                });
            };

            $scope.removeProfiles = function () {
                var delete_ids = [];
                var tip = $filter('translate')('Are you sure to delete') + ' ?';

                $scope.profiles.map(function (e) {
                    if (e.toRemove) {
                        delete_ids.push(e.id);
                    }
                });

                if (delete_ids.length && confirm(tip)) {
                    Profile.delete({ids: delete_ids.join(',')}, function (data) {
                        Profile.list({page: $scope.pagination.page}, getProfileList);
                    });
                }
            };
        }
    ])

    .controller('settings_group', ['$scope',
        function ($scope) {
            $scope.selectedGroup = {};
            $scope.groupRules = [
                {'title': 'Added Manually', 'value': 'manually'},
                {'title': 'Added by Rules', 'value': 'rule'}
            ];
            options = {
                data: test_group_data,
                nodeIcon: "glyphicon glyphicon-folder-close",
                onNodeSelected: function (event, data) {
                    $scope.$apply(function () {
                        $scope.selectedGroup = data;
                    });
                },
                onNodeUnselected: function () {
                    $scope.$apply(function () {
                        $scope.selectedGroup = {};
                    });
                }
            };
            $('#groupTree').treeview(options);

            $scope.deleteGroup = function (group) {
                if (confirm('Delete group ' + group.text + '?')) {
                    options.data = test_group_delete_data;
                    $('#groupTree').treeview(options);
                }
            };

            $scope.saveGroup = function () {
                console.log('save ' + $scope.selectedGroup.text);
                console.log($scope.selectedGroup.rule);
            }

            $scope.addGroup = function (group) {
                options.data = test_data;
            };

            $scope.editGroup = function (group) {
                options.data = test_data;
            };
        }
    ])

    .controller('settings_email', ['$scope', '$filter', 'Config',
        function ($scope, $filter, Config) {
            var setEmailConfigs = function (data) {
                $scope.emailConfigs = data;
                $scope.emailFormData = JSON.parse($scope.emailConfigs.value);
            }

            Config.get('email', function (data) {
                $scope.emailConfigs = {};
                $scope.emailFormData = {smtp_port: 25, smtp_ssl: false, email_notify: true};

                if (data) {
                    setEmailConfigs(data);
                }
            });

            $scope.saveEmailConfigs = function () {
                var id = $scope.emailConfigs.id || '';
                var config = {
                    title: 'email',
                    type: 'email',
                    value: JSON.stringify($scope.emailFormData)
                }

                if (id) {
                    config.id = id;
                }

                Config.add(config, function (data) {
                    setEmailConfigs(data);
                    ht.noty($filter('translate')('Save Successfully') + '!');
                });
            };

            $scope.sendTestMail = function () {
                Config.testMail($scope.emailFormData, function (data) {
                    status = data.status;
                    message = {true: 'successfully', false: 'fail'}[status];
                    ht.noty($filter('translate')('Send mail ' + message) + '!');
                });
            };
        }
    ])
;


var test_profiles = [
    {name: 'profile1', description: 'dexc1'},
    {name: 'profile2', description: 'dexc2'},
    {name: 'profile3', description: 'dexc3'},
    {name: 'profile4', description: 'dexc4'},
    {name: 'profile5', description: 'dexc5'},
    {name: 'profile6', description: 'dexc6'},
    {name: 'profile7', description: 'dexc7'},
]

var test_group_data = [
    {
        'group_id': 1,
        text: 'group1',
        'rule': 'rule',
        'nodes': [
            {'text': 'group2'},
            {'text': 'group3'},
        ]
    }
];

var test_group_delete_data = [
    {
        'group_id': 1,
        text: 'group1',
    }
];