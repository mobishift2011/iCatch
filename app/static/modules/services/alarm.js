angular.module('alarmServices', ['ngResource'])
    .factory('Alarm', ['$resource', 'sys',
        function ($resource, sys) {
            var url = sys.API + '/alarm/:alarmId/';
            var resource = $resource(url, {alarmId: '@id'});

            var statUrl = sys.API + '/alarm/:object/stats';
            var statResource = $resource(statUrl, {object: '@object'}, {
                getStats: {
                    method: 'GET',
                }
            });

            return {
                get: resource.get,
                add: resource.save,
                getStats: statResource.getStats,
            }
        }
    ])
;