angular
    .module('DrawingApp.controllers', [])
    .controller('AppCtrl', ['$scope', '$sce', '$window', '$modal', 'DB', function AppCtrl($scope, $sce, $window, $modal, DB) {

        /* Safe Apply */
        $scope.SafeApply = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        /* Canvas size */
        $scope.canvasSize = ToolsManager.getCanvasSize();
        $scope.ChangeCanvasSize = function() {
            if(SocketManager.isSharing()) return NotifyManager.warning('Resize is disabled on sharing mode');

            $modal
                .open({
                    templateUrl: 'views/canvasSizeModal.html',
                    controller: 'CanvasSizeModalCtrl',
                    backdrop: false,
                    size: 'sm',
                    resolve: {
                        data: function() {
                            return {
                                item: $scope.canvasSize
                            };
                        }
                    }
                })
                .result.then(function (editedItem) {
                    console.log(editedItem);

                    $scope.canvasSize = editedItem;
                    ToolsManager.changeCanvasSize(editedItem);
                });
        };
        ToolsManager.on('setCanvasSize', function(size) {
            $scope.canvasSize.width = size.width;
            $scope.canvasSize.height = size.height;
            $scope.SafeApply();
        });

        /* Login */
        $scope.ShowLogin = function() {
            if(AccountManager.getLoginStatus()) return;

            $modal
                .open({
                    templateUrl: 'views/loginModal.html',
                    controller: 'LoginModalCtrl',
                    backdrop: true,
                    size: 'sm'
                })
                .result.then(function () { }, function (code) {
                    if(code == 'SignUp') {
                        $scope.ShowSignUp();
                    }
                });
        };

        /* Sign up */
        $scope.ShowSignUp = function() {
            if(AccountManager.getLoginStatus()) return;

            $modal
                .open({
                    templateUrl: 'views/signUpModal.html',
                    controller: 'LoginModalCtrl',
                    backdrop: true,
                    size: 'sm'
                })
                .result.then(function () { }, function(code) {
                    if(code == 'Login') {
                        $scope.ShowLogin();
                    }
                });
        };

        /* Update */
        $scope.ShowUpdate = function() {
            if(!AccountManager.getLoginStatus()) return;

            $modal
                .open({
                    templateUrl: 'views/editUserModal.html',
                    controller: 'LoginModalCtrl',
                    backdrop: true,
                    size: 'sm'
                })
                .result.then(function () { }, function(code) {
                    if(code == 'Login') {
                        $scope.ShowLogin();
                    }
                });
        };

        /* Open */
        $scope.OpenFile = function() {
            $modal
                .open({
                    templateUrl: 'views/openFileModal.html',
                    controller: 'OpenFileModalCtrl',
                    backdrop: true,
                    size: 'sm'
                })
                .result.then(function () { }, function(code) { });
        };

        /* Sign out */
        $scope.Logout = function() {
            AccountManager.logout();
            SocketManager.leaveSharing(function() {
                SocketManager.unIdentify();
            });
            NotifyManager.success('Sign out success');
        };

        /* Share with friends */
        $scope.ShareWithFriend = function() {
            $modal
                .open({
                    templateUrl: 'views/paintWithFriendsModal.html',
                    controller: 'PaintWithFriendsModalCtrl',
                    backdrop: false,
                    size: 'sm'
                })
                .result.then(function () { });
        };
    }])
    .controller('CanvasSizeModalCtrl', ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {

        $scope.item = angular.copy(data.item);
        var content = document.getElementById('content');
        $scope.FullViewPort = function() {
            $scope.item.width = content.clientWidth - 60;
            $scope.item.height = content.clientHeight - 65;
        };

        $scope.Apply = function () {
            $modalInstance.close($scope.item);
        };
        $scope.Cancel = function () {
            $modalInstance.dismiss('Cancel');
        };
    }])
    .controller('LoginModalCtrl', ['$scope', '$modalInstance', 'DB', function($scope, $modalInstance, DB) {

        /* Safe Apply */
        $scope.SafeApply = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.error = {message: null};
        var mainContainer = document.getElementById('container');

        /* Login */
        $scope.login = {username: null, password: null};

        $scope.Login = function(type) {
            mainContainer.classList.add('is-loading');

            if(type && type == 'facebook') {
                AccountManager.loginFacebook()
                    .then(function(info) {
                        return DB.Users
                            .exists({}, {username: info.id}).$promise
                            .catch(function() {
                                return DB.Users.saveFb({}, info).$promise;
                            })
                            .then(function() {
                                return DB.Sessions.loginSocial({}, {id: info.id}).$promise;
                            })
                            .then(function(user) {
                                if(!user.picture) user.picture = info.picture;
                                user.link = info.link;
                                AccountManager.setAccountInfo(user);
                                NotifyManager.success('Sign in success');
                                $modalInstance.dismiss('OK');
                            })
                            .catch(function(err) {
                                $scope.error.message = err.data.message;
                            });
                    })
                    .catch(function(err) { console.log(err); })
                    .done(function() {
                        mainContainer.classList.remove('is-loading');
                    });
            } else if(type && type == 'google') {
                AccountManager.loginGooglePlus()
                    .then(function(info) {
                        console.log(info);

                        return DB.Users
                            .exists({}, {username: info.id}).$promise
                            .catch(function() {
                                return DB.Users.saveGp({}, info).$promise;
                            })
                            .then(function() {
                                return DB.Sessions.loginSocial({}, {id: info.id}).$promise;
                            })
                            .then(function(user) {
                                if(!user.picture) user.picture = info.image.url.replace('sz=50', 'sz=100');
                                user.link = info.url;
                                AccountManager.setAccountInfo(user);
                                NotifyManager.success('Sign in success');
                                $modalInstance.dismiss('OK');
                            })
                            .catch(function(err) {
                                $scope.error.message = err.data.message;
                            })
                    })
                    .catch(function(err) { console.log(err); })
                    .done(function() {
                        mainContainer.classList.remove('is-loading');
                    });
            } else {
                DB.Sessions.login({}, $scope.login).$promise
                    .then(function(user) {
                        $modalInstance.dismiss('OK');
                        AccountManager.setAccountInfo(user);
                        NotifyManager.success('Sign in success');
                        mainContainer.classList.remove('is-loading');
                    }).catch(function(err) {
                        $scope.error.message = err.data.message;
                        mainContainer.classList.remove('is-loading');
                    });
            }
        };
        $scope.ShowSignUp = function() {
            $modalInstance.dismiss('SignUp');
        };

        /* Sign up */
        $scope.signUp = {id: null, username: null, fullname: null, password: null, passwordConfirm: null, passwordOld: null, picture: null, file: null};
        var info = AccountManager.getAccountInfo();
        if(info) {
            if(info.id) $scope.signUp.id = info.id;
            if(info.username) $scope.signUp.username = info.username;
            if(info.fullname) $scope.signUp.fullname = info.fullname;
            if(info.picture) $scope.signUp.picture = info.picture;
        }

        $scope.SignUp = function() {
            delete $scope.signUp.file;
            delete $scope.signUp.passwordOld;
            mainContainer.classList.add('is-loading');

            DB.Users.save({}, $scope.signUp).$promise
                .then(function() {
                    return DB.Sessions.login({}, $scope.signUp).$promise;
                })
                .then(function(user) {
                    NotifyManager.success('Create account success');
                    AccountManager.setAccountInfo(user);
                    $modalInstance.dismiss('OK');
                    mainContainer.classList.remove('is-loading');
                })
                .catch(function(err) {
                    if(err.data == 'ER_DUP_ENTRY') err.data = {message: 'Username is not available'};
                    $scope.error.message = err.data.message;
                    mainContainer.classList.remove('is-loading');
                });
        };
        $scope.ShowLogin = function() {
            $modalInstance.dismiss('Login');
        };
        $scope.Update = function() {
            delete $scope.signUp.file;
            mainContainer.classList.add('is-loading');

            DB.Users.save({id: $scope.signUp.id}, $scope.signUp).$promise
                .then(function(user) {
                    AccountManager.setAccountInfo(user);
                    NotifyManager.success('Update account info success');
                    $modalInstance.dismiss('OK');
                    mainContainer.classList.remove('is-loading');
                })
                .catch(function(res) {
                    $scope.error.message = res.data.message;
                    mainContainer.classList.remove('is-loading');
                });
        };

        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.addEventListener('load', function() {
                var c = ToolsManager.resizeImage(img, 80);
                $scope.signUp.picture = c.toDataURL('image/png');

                $scope.SafeApply();
            });
            img.src = e.target.result;
        };
        $scope.$watch('signUp.file', function(newVal) {
            if(newVal) {
                var file = newVal.item(0);
                if(file.size > 1024 * 1024) {
                    return NotifyManager.error('Only png/jpeg images smaller than 1MB are accepted');
                }
                reader.readAsDataURL(file);
            }
        });

        $scope.Cancel = function () {
            $modalInstance.dismiss('Cancel');
        };
    }])
    .controller('OpenFileModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
        var mainContainer = document.getElementById('container');

        /* File reader */
        var reader = new FileReader();
        reader.onload = function(e) {
            ToolsManager.openImage(e.target.result);
            SocketManager.broadcastImage(e.target.result);
            $modalInstance.close();
        };

        /* Open file local */
        $scope.file = {file: null};
        $scope.$watch('file.file', function(newVal) {
            if(newVal) {
                var file = newVal.item(0);
                if(file.size > 3 * 1024 * 1024) {
                    return NotifyManager.error('Only png/jpeg images smaller than 3MB are accepted');
                }
                reader.readAsDataURL(file);
            }
        });

        /* Dropbox */
        $scope.OpenDropbox = function() {
            mainContainer.classList.add('is-loading');
            FileManager.selectWithDropbox()
                .then(function(blob) {
                    reader.readAsDataURL(blob);
                    mainContainer.classList.remove('is-loading');
                })
                .catch(function(err) {
                    mainContainer.classList.remove('is-loading');
                    console.log(err);
                    NotifyManager.error(err);
                });
        };

        /* Google Drive */
        $scope.OpenGoogleDrive = function() {
            mainContainer.classList.add('is-loading');
            FileManager.selectWithGoogleDrive()
                .then(function(blob) {
                    reader.readAsDataURL(blob);
                    mainContainer.classList.remove('is-loading');
                })
                .catch(function(err) {
                    mainContainer.classList.remove('is-loading');
                    console.log(err);
                    NotifyManager.error(err);
                });
        };

        $scope.Cancel = function () {
            $modalInstance.dismiss('Cancel');
        };
    }]);