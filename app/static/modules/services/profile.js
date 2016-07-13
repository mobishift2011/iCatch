angular.module('profileServices', ['ngResource'])
    .factory('Profile', ['$resource', 'sys',
        function($resource, sys){
            var url = sys.API + '/profile/:profileId/';
            var resource = $resource(url, {profileId: '@id'}, {
                'delete': {
                    method: 'DELETE',
                    params: {profileId: 'delete'}
                }
            });

            return {
                list: resource.get,
                get: resource.get,
                add: resource.save,
                delete: resource.delete,
            }
        }
    ])
;