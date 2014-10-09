angular
    .module('DrawingApp.modules')
    .factory('DB', ['$resource', function($resource) {
        return {
            Sessions: $resource('/:action', {action: '@action'}, {
                login: { method: 'POST', params: { action: 'login' } },
                loginSocial: { method: 'POST', params: { action: 'loginSocial' } },
                logout: { method: 'GET', params: { action: 'logout' } }
            }),

            Users: $resource('/user/:id', {id: '@id'}, {
                me: { method: 'GET', params: { id: 'me' } },
                exists: { method: 'POST', params: { id: 'exists' } },
                saveFb: { method: 'POST', params: { id: 'fb' } },
                saveGp: { method: 'POST', params: { id: 'gp' } }
            })
        }
    }]);