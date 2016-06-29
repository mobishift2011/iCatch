angular.module('settingsCtrls', [])
    .controller('settings', ['$scope', '$state', function ($scope, $state) {
        $scope.sidebar = {
            title: 'Settings',
            items: [
                {title: 'Basic Settings', state: 'settings_basic', icon: 'glyphicon-home'},
                {title: 'Users Management', state: 'settings_user', icon: 'glyphicon-user'},
                {title: 'Profiles Management', state: 'settings_profile', icon: 'glyphicon-file'},
                {title: 'Groups Management', state: 'settings_group', icon: 'glyphicon-folder-close'}
            ]
        }
        $state.go('settings_basic');
    }])

    .controller('settings_basic', ['$scope',
        function ($scope) {
            $scope.configs = {
                timeZone: 'America/Los Angelos',
                profile: 'test profile1',
                fileHash: 'md5'
            }
            $scope.tzs = [
                'America/Los Angelos',
                'Chinese/Beijing',
            ]
            $scope.profiles = [
                'test profile',
                'test profile1',
                'test profile2'

            ]
            $scope.fileHashs = [
                {title: 'MD5', value: 'md5'},
                {title: 'SHA256 & MD5', value: 'SHA256_and_MD5'},
            ]

            var tzBtnText = 'Change Timezone'
            var profileBtnText = 'Change Profile'
            var confirmBtnText = 'Confirm';

            $scope.tzBtnText = tzBtnText;
            $scope.profileBtnText = profileBtnText;

            $scope.selectedTimeZone = $scope.configs.timeZone;
            $scope.clickChangeZone = function () {
                if ($scope.isChangeZone) {
                    // if($scope.selectedTimeZone !== $scope.configs.timeZone){
                    //     alert($scope.configs.timeZone);
                    //     //todo
                    //     $scope.configs.timeZone = $scope.selectedTimeZone;
                    // }

                }
                $scope.tzBtnText = ($scope.tzBtnText === tzBtnText) ? confirmBtnText : tzBtnText;
                $scope.isChangeZone = !$scope.isChangeZone;
            }

            $scope.selectedProfile = $scope.configs.profile;
            $scope.clickChangeProfile = function () {
                if ($scope.isChangeProfile) {
                    if ($scope.selectedProfile !== $scope.configs.profile) {
                        alert($scope.configs.profile);
                        //todo
                        $scope.configs.profile = $scope.selecedProfile;
                    }
                }
                $scope.profileBtnText = ($scope.profileBtnText === profileBtnText) ? confirmBtnText : profileBtnText;
                $scope.isChangeProfile = !$scope.isChangeProfile;
            }
            $scope.changeAlgorithm = function () {
                console.log($scope.configs.fileHash);
            }
        }
    ])

    .controller('settings_user', ['$scope',
        function ($scope) {
            $scope.users = test_users;

            $scope.checkAll = function () {
                for (var i in $scope.users) {
                    $scope.users[i].toRemove = $scope.toRemoveAll;
                }
            };

            $scope.removeUsers = function () {
                if(confirm('Are you sure to delete?')) {
                    this.toRemoveAll = false;
                    for (var i = ($scope.users.length - 1); i >= 0; i--) {
                        if ($scope.users[i].toRemove) {
                            $scope.users.splice(i, 1);
                        }
                    }
                }
            }
        }
    ])

    .controller('settings_profile', ['$scope',
        function ($scope) {
            $scope.profiles = test_profiles;
            $scope.addProfile = function () {
                $scope.profiles.push({'name': 'testddd', 'description': 'testAdd'});
            };
            $scope.checkAll = function () {
                var that = this;
                angular.forEach($scope.profiles, function (e) {
                    e.toRemove = that.toRemoveAll;
                });
            };
            $scope.removeProfiles = function () {
                if(confirm('Are you sure to delete?')){
                    this.toRemoveAll = false;
                    for (var i = ($scope.profiles.length - 1); i >= 0; i--) {
                        if ($scope.profiles[i].toRemove) {
                            $scope.profiles.splice(i, 1);
                        }
                    }
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
var test_users = [
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
    {
        'username': 'ethan',
        'email': 'sorrowkid@163.com',
        'role': 'admin',
        'dateAdded': '1927-07-12'
    },
];

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