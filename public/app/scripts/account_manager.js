AccountManager = new function() {
    this.events = {};
    this.on = function (event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };
    this.emit = function (event, data) {
        var callbacks = this.events[event];
        if (callbacks) {
            callbacks.forEach(function (callback) {
                callback(data);
            });
        }
    };
    var self = this;

    var googleAppId = '874956188791';
    var googleBrowserKey = 'AIzaSyBxZr8BH36lWZr7G7gCaBW12WeMZXKJUtY';
    var googleClientId = '874956188791-7g0gbnjf3rmb4mvaonti15eg8ahp996f.apps.googleusercontent.com';
    this.getGoogleAppId = function() {
        return googleAppId;
    };
    this.getGoogleClientId = function() {
        return googleClientId;
    };
    this.getGoogleBrowserKey = function() {
        return googleBrowserKey;
    };


    var loginStatus = false;
    var loginStatusChecked = false;
    var accountInfo = null;
    var fbInitiated = false;
    var fbConnected = false;
    var fbInfo = null;
    var gpInitiated = false;
    var gpConnected = false;
    var gpInfo = null;
    var loginTool = document.getElementById('login-tool');

    function __parseStr(jsonText) {
        return JSON.parse(jsonText);
    }

    this.facebookInitiated = function() {
        fbInitiated = true;

        FB.getLoginStatus(function (res) {
            if (res.status != 'connected') return;
            fbConnected = true;

            console.log('fb connected');
            getFacebookAccountInfo('me', function (info) {
                fbInfo = info;
                if(loginStatus) {
                    accountInfo.link = info.link;
                    if(!accountInfo.picture) accountInfo.picture = info.picture;
                    self.setAccountInfo(accountInfo);
                }
            });
        });
    };
    this.googleAPIInitiated = function() {

        self._loadGoogleModule(null, 'auth')
            .then(function() {
                return self._loadGoogleModule(null, 'client');
            })
            .then(function() {
                return self._loadGoogleModule('client', 'plus', 'v1');
            })
            .then(function() {
                gpInitiated = true;
                return self._loadGoogleModule('client', 'drive', 'v2');
            })
            .then(function() {
                return self._loadGoogleModule(null, 'picker');
            })
            .then(_reAuthorizeGooglePlus)
            .then(function(connected) {
                gpConnected = connected;
                if(!connected) return new Error('Not connected');
                return 'me';
            })
            .then(getGooglePlusAccountInfo)
            .then(function(info) {
                gpInfo = info;
                if(loginStatus) {
                    accountInfo.link = info.url;
                    if(!accountInfo.picture) accountInfo.picture = info.image.url.replace('sz=50', 'sz=100');
                    self.setAccountInfo(accountInfo);
                }
            });
    };

    this.getLoginStatus = function () {
        return loginStatus;
    };
    this.getAccountInfo = function () {
        return accountInfo;
    };
    this.setAccountInfo = function (info) {
        if(info) {
            loginStatus = true;
            accountInfo = info;
            self.emit('accountInfoUpdated', accountInfo);
        } else {
            loginStatus = false;
            accountInfo = null;
            self.emit('accountInfoUpdated', accountInfo);
        }
    };

    function getFacebookAccountInfo(username) {
        var deferred = Q.defer();

        if(!fbInitiated) {
            deferred.resolve(null);
        } else {
            var imageDone = 0, infoDone = 0, info = {};
            username = username || 'me';

            FB.api('/' + username + '/picture?type=square&height=70&width=70', function (response) {
                info.picture = response.data.url;

                imageDone = 1;
                if (imageDone && infoDone) deferred.resolve(info);
            });

            FB.api('/' + username, function (response) {
                info.email = response.email;
                info.name = response.name;
                info.first_name = response.first_name;
                info.last_name = response.last_name;
                info.gender = response.gender;
                info.link = response.link;
                info.id = response.id;

                infoDone = 1;
                if (imageDone && infoDone) deferred.resolve(info);
            });
        }
        return deferred.promise;
    }
    this.getMemberAccountInfo = function(username) {
        return Request
            .get('/user/' + username, null)
            .then(__parseStr)
            .then(self.updateMemberAccountInfo);
    };
    this.updateMemberAccountInfo = function(user) {
        if(user.type == 'fb' && fbInitiated && !user.picture) {
            return getFacebookAccountInfo(user.username).then(function(info) {
                if(info) {
                    user.picture = info.picture;
                    user.link = info.link;
                }

                return user;
            });
        } else if(user.type == 'gp' && gpInitiated && !user.picture) {
            return getGooglePlusAccountInfo(user.username).then(function(info) {
                if(info) {
                    user.picture = info.image.url.replace('sz=50', 'sz=100');
                    user.link = info.url;
                }

                return user;
            })
        } else {
            return user;
        }
    };

    this.checkFriendStatus = function(username) {
        return Request.get('/friend/' + username + '/status', null).then(__parseStr);
    };
    this.makeFriendRequest = function(username) {
        return Request.post('/friend/' + username + '/request', null);
    };
    this.acceptFriendRequest = function(username) {
        return Request.post('/friend/' + username + '/accept', null);
    };
    this.rejectFriendRequest = function(username) {
        return Request.post('/friend/' + username + '/reject', null);
    };
    this.findUserNotFriend = function(text) {
        return Request.get('/friend/' + text + '/search', null).then(__parseStr);
    };

    this.init = function() {
        loginTool.classList.add('is-loading');

        Request.get('/user/me', null)
            .then(__parseStr)
            .then(function(myInfo) {
                if(myInfo.type == 'fb' && fbInitiated) {
                    if(fbInfo) {
                        myInfo.link = fbInfo.link;
                        if(!myInfo.picture) myInfo.picture = fbInfo.picture;
                        self.setAccountInfo(myInfo);
                    } else {
                        return _getFacebookLoginStatus()
                            .then(function(status) {
                                if(status != 'connected') {
                                    self.setAccountInfo(myInfo);
                                    return;
                                }

                                fbConnected = true;
                                return getFacebookAccountInfo('me').then(function(myFbInfo) {
                                    if(!myFbInfo) {
                                        self.setAccountInfo(myInfo);
                                        return;
                                    }

                                    myInfo.link = myFbInfo.link;
                                    if(!myInfo.picture) myInfo.picture = myFbInfo.picture;
                                    self.setAccountInfo(myInfo);
                                });
                            });
                    }
                } else if(myInfo.type == 'gp' && gpInitiated) {
                    if(gpInfo) {
                        myInfo.link = gpInfo.url;
                        if(!myInfo.picture) myInfo.picture = gpInfo.image.url.replace('sz=50', 'sz=100');
                        self.setAccountInfo(myInfo);
                    } else {
                        return _reAuthorizeGooglePlus()
                            .then(function(connected) {
                                gpConnected = connected;
                                if(!connected) {
                                    self.setAccountInfo(myInfo);
                                    return;
                                }

                                return getGooglePlusAccountInfo('me').then(function(myGpInfo) {
                                    if(!myGpInfo) {
                                        self.setAccountInfo(myInfo);
                                        return;
                                    }

                                    myInfo.link = myGpInfo.link;
                                    if(!myInfo.picture) myInfo.picture = myGpInfo.image.url.replace('sz=50', 'sz=100');
                                    self.setAccountInfo(myInfo);
                                });
                            });
                    }
                } else {
                    self.setAccountInfo(myInfo);
                }
            })
            .catch(function(err) {
                loginTool.classList.remove('is-loading');
            })
            .done(function() {
                loginTool.classList.remove('is-loading');
            });
    };

    function _loginFacebook() {
        var deferred = Q.defer();

        FB.login(function (res) {
            if (res.status === 'connected') {
                fbConnected = true;
                deferred.resolve('me');
            } else {
                console.log('not connect');
                deferred.reject(false);
            }
        }, {scope: 'public_profile, email'});

        return deferred.promise;
    }
    function _getFacebookLoginStatus() {
        var deferred = Q.defer();

        FB.getLoginStatus(function (res) {
            deferred.resolve(res.status);
        });

        return deferred.promise;
    }
    this.loginFacebook = function() {
        if(!fbInitiated) return false;
        return _loginFacebook().then(getFacebookAccountInfo);
    };

    this._loadGoogleModule = function(root, name, ver) {
        var deferred = Q.defer();

        if(!root) {
            gapi.load(name, function() {
                deferred.resolve();
            });
        } else {
            gapi[root].load(name, ver, function() {
                deferred.resolve();
            });
        }

        return deferred.promise;
    };
    function _getGooglePlusAccountInfo(user) {
        var deferred = Q.defer();

        var request = gapi.client.plus.people.get({ 'userId': user });
        request.execute(function(res) {
            deferred.resolve(res);
        });

        return deferred.promise;
    }
    function getGooglePlusAccountInfo(user) {

        return _reAuthorizeGooglePlus().then(function(connected) {
            gpConnected = connected;
            if(!connected) return null;

            return _getGooglePlusAccountInfo(user);
        });
    }
    function _loginGooglePlus(scope) {
        var deferred = Q.defer();

        gapi.auth.signIn({scope: scope || 'profile', callback: function(info) {
            console.log(info);
            if(info.status.signed_in) {
                deferred.resolve('me');
            } else {
                console.log('Login google: ' + info.status.google_logged_in);
                console.log('Signed in app: ' + info.status.signed_in);
                deferred.reject(false);
            }
        }});

        return deferred.promise;
    }
    function _reAuthorizeGooglePlus(scope, immediate) {
        var deferred = Q.defer();

        gapi.auth.authorize({client_id: googleClientId, immediate: immediate || true, scope: scope || 'profile'}, function(info) {
            gpConnected = info.status.signed_in;
            deferred.resolve(info.status.signed_in);
        });

        return deferred.promise;
    }
    this.authorizeGooglePlus = function(scope, immediate) {
        return _reAuthorizeGooglePlus(scope, immediate);
    };
    this.loginGooglePlus = function(scope) {
        if(!gpInitiated) return false;
        return _reAuthorizeGooglePlus(scope)
            .then(function(connected) {
                if(!scope || scope == 'profile') {
                    gpConnected = connected;
                    if(gpConnected) return _getGooglePlusAccountInfo('me');
                    return _loginGooglePlus().then(_getGooglePlusAccountInfo);
                } else return _loginGooglePlus(scope);
            });
    };

    this.logout = function() {
        Request.get('/logout', null).then(function() {
            self.setAccountInfo(null);
            self.emit('signedOut');
        }).done();
    };
};

