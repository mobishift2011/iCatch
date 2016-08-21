angular.module('computerServices', ['ngResource'])
    .factory('Computer', ['$resource', 'sys',
        function($resource, sys){
            var url = sys.API + '/computer/:computerId/';
            var resource = $resource(url, {computerId: '@id'}, {
                sensorList: {
                    method: 'GET',
                    params: {computerId: 'sensor'},
                    isArray: true
                },
                uninstall: {
                    method: 'GET',
                    params: {computerId: 'uninstall'},
                },
                pause: {
                    method: 'GET',
                    params: {computerId: 'pause'},
                },
                resume: {
                    method: 'GET',
                    params: {computerId: 'resume'},
                },
                quarantine: {
                    method: 'GET',
                    params: {computerId: 'quarantine'},
                },
                cancel_quarantine: {
                    method: 'GET',
                    params: {computerId: 'quarantine/cancel'},
                },
                addProfile: {
                    method: 'GET',
                    params: {computerId: 'addProfile'},
                },
                upgrade: {
                    method: 'GET',
                    params: {computerId: 'upgrade'},
                },
            });

            return {
                get: resource.get,
                add: resource.save,
                sensorList: resource.sensorList,
                uninstall: resource.uninstall,
                pause: resource.pause,
                on: resource.resume,
                quarantine: resource.quarantine,
                cancel_quarantine: resource.cancel_quarantine,
                addProfile: resource.addProfile,
                upgrade: resource.upgrade,
            }
        }
    ])
;