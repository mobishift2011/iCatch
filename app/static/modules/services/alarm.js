angular.module('alarmServices', ['ngResource'])
    .factory('Alarm', ['$resource', 'sys',
        function ($resource, sys) {
            var url = sys.API + '/alarm/:alarmId/';
            var resource = $resource(url, {alarmId: '@id'});
            return {
                get: resource.get,
                add: resource.save
            }
        }
    ])
;