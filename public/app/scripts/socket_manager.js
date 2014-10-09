SocketManager = new function() {
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
    var socket = io(window.location.origin, {
        'max reconnection attempts': 'Infinite',
        'reconnection limit': 5000
    });

    var IDENTIFY = 'drawing_identify';
    var UN_IDENTIFY = 'drawing_un_identify';
    var START_SHARING_EVENT = 'drawing_start_sharing';
    var JOIN_SHARED_EVENT = 'drawing_join_shared';
    var LEAVE_SHARED_EVENT = 'drawing_leave_shared';
    var NEW_MEMBER_EVENT = 'drawing_new_member';
    var LEAVE_MEMBER_EVENT = 'drawing_leaving_member';
    var GROUP_INFO = 'drawing_group_info';

    var GIVE_INIT_IMAGE_EVENT = 'drawing_give_me_init_image';
    var RECEIVE_INIT_IMAGE_EVENT = 'drawing_here_ur_init_image';
    var GIVE_INIT_MESSAGES_EVENT = 'drawing_give_me_init_messages';
    var RECEIVE_INIT_MESSAGES_EVENT = 'drawing_here_ur_init_messages';
    var NEW_BRUSH_EVENT = 'drawing_new_brush';
    var NEW_IMAGE_EVENT = 'drawing_new_image';
    var NEW_MESSAGE_EVENT = 'drawing_new_message';
    var NEW_MESSAGES_EVENT = 'drawing_new_messages';

    var ONLINE_STATUS_EVENT = 'drawing_online_status';
    var FRIEND_STATUS_CHANGED_EVENT = 'drawing_friend_request_changed';

    var sharingKey = null;
    var isMaster = 0;
    var isIdentified = 0;
    var isConnected = 0;

    socket.on('connect', function() {
        console.log('I\'m connected!');

        isConnected = 1;

        //TODO Call identify
        if(AccountManager.getLoginStatus())
            self.identify(AccountManager.getAccountInfo());
    });

    socket.on('disconnect', function() {
        sharingKey = null;
        isMaster = 0;
        isConnected = 0;
        isIdentified = 0;
        self.emit('disconnected');
        self.emit('stopSharing');
    });

    this.isIdentified = function() {
        return isIdentified;
    };

    this.isConnected = function() {
        return isConnected;
    };

    this.isSharing = function() { return !!sharingKey };

    this.getSharingKey = function() {
        return sharingKey;
    };

    this.getSharingInfo = function() {
        var res =  {
            isMaster: isMaster,
            sharing: this.isSharing(),
            sharingKey: null,
            sharedKey: null
        };
        if(res.sharing && res.isMaster) {
            res.sharingKey = sharingKey;
            res.sharedKey = null;
        }
        if(res.sharing && !res.isMaster) {
            res.sharedKey = sharingKey;
            res.sharingKey = null;
        }
        return res;
    };

    this.getGroupMembers = function(done) {
        socket.emit(GROUP_INFO, sharingKey, function(groupInfo) {
            window.setTimeout(function() {
                done(groupInfo);
            }, 0);
        });
    };

    this.identify = function(info) {
        socket.emit(IDENTIFY, info, function() {
            window.setTimeout(function() {
                self.emit('connected');

                var oldSharedKey = StorageManager.getItem('html5-drawing-shared-key');
                if (oldSharedKey) {
                    NotifyManager.info('Try to join last joined group');
                    self.joinSharing(oldSharedKey, function(error) {
                        if(error) {
                            console.log(error);
                            self.startSharing(oldSharedKey, function() { });
                        }
                    })
                }
            }, 0);
        });
    };

    this.unIdentify = function() {
        socket.emit(UN_IDENTIFY);
    };

    this.startSharing = function(_sharedKey, done) {
        socket.emit(START_SHARING_EVENT, _sharedKey, function(_sharingKey) {
            window.setTimeout(function() {
                if(_sharingKey === false) {
                    done();
                } else {
                    sharingKey = _sharingKey;
                    isMaster = 1;
                    self.emit('startSharing');
                    done(_sharingKey);
                    console.log('Started sharing with key ' + _sharingKey);
                }
            }, 0);
        });
    };

    this.joinSharing = function(_sharingKey, done) {
        if(!_sharingKey) return;

        socket.emit(LEAVE_SHARED_EVENT, function(errorMessage) {
            window.setTimeout(function() {
                if(errorMessage) console.log(errorMessage);

                isMaster = 0;
                sharingKey = null;
                socket.emit(JOIN_SHARED_EVENT, _sharingKey, function(error) {
                    window.setTimeout(function() {
                        if(error) done(error);
                        else {
                            sharingKey = _sharingKey;
                            console.log('Successfully joined to ' + _sharingKey);
                            self.emit('block', 'Wait for data synchronizing!');
                            self.requestInitImage();
                            self.requestInitMessages();
                            self.emit('joinSharing');
                            done();
                        }
                    }, 0);
                });
            }, 0);
        });
    };

    this.leaveSharing = function(done) {
        socket.emit(LEAVE_SHARED_EVENT, function(errorMessage) {
            window.setTimeout(function() {
                if(errorMessage) console.log(errorMessage);

                sharingKey = null;
                isMaster = 0;
                self.emit('stopSharing');
                done(errorMessage);
            }, 0);
        });
    };

    this.requestInitImage = function() {
        if(!sharingKey) return;
        socket.emit(GIVE_INIT_IMAGE_EVENT, function(errorMessage) {
            window.setTimeout(function() {
                if(errorMessage) console.log(errorMessage);
            }, 0);
        });
    };

    this.requestInitMessages = function() {
        if(!sharingKey) return;
        socket.emit(GIVE_INIT_MESSAGES_EVENT, function(errorMessage) {
            window.setTimeout(function() {
                if(errorMessage) console.log(errorMessage);
            }, 0);
        });
    };

    socket.on(GIVE_INIT_IMAGE_EVENT, function(to, done) {
        window.setTimeout(function() {
            if(to && done) self.emit('requestInitImage', done);
        }, 0);
    });

    socket.on(RECEIVE_INIT_IMAGE_EVENT, function(initImage) {
        window.setTimeout(function() {
            self.emit('sharingNewImage', initImage);
            NotifyManager.success('Drawing synchronized');
        }, 0);
    });

    socket.on(GIVE_INIT_MESSAGES_EVENT, function(to, done) {
        window.setTimeout(function() {
            if(to && done) self.emit('requestInitMessages', done);
        }, 0);
    });

    socket.on(RECEIVE_INIT_MESSAGES_EVENT, function(messages) {
        window.setTimeout(function() {
            self.emit('sharingInitMessages', messages);
        }, 0);
    });

    this.broadcastImage = function(imageData) {
        if(!sharingKey) return;
        if(!imageData) return;
        socket.emit(NEW_IMAGE_EVENT, {to_sharing_key: sharingKey, data: imageData});
    };

    this.broadcastNewBrush = function(brushOptions) {
        if(!sharingKey) return;
        if(!brushOptions) return;
        socket.emit(NEW_BRUSH_EVENT, {to_sharing_key: sharingKey, data: brushOptions});
    };

    this.broadcastMessage = function(message) {
        socket.emit(NEW_MESSAGE_EVENT, {to_sharing_key: sharingKey, data: message});
    };

    this.sendMessage = function(message, to) {
        socket.emit(NEW_MESSAGE_EVENT, {to_user: to, data: message});
    };

    this.sendMessages = function(messages, to) {
        socket.emit(NEW_MESSAGES_EVENT, {to_user: to, data: messages});
    };

    socket.on(NEW_BRUSH_EVENT, function(brushOptions) {
        if(!brushOptions) return;
        window.setTimeout(function() {
            self.emit('sharingNewBrush', brushOptions);
        }, 0);
    });

    socket.on(NEW_IMAGE_EVENT, function(imageData) {
        if(!imageData) return;
        window.setTimeout(function() {
            self.emit('sharingNewImage', imageData);
        }, 0);
    });

    socket.on(NEW_MEMBER_EVENT, function(name) {
        window.setTimeout(function() {
            self.emit('newMember', name);
        }, 0);
    });

    socket.on(LEAVE_MEMBER_EVENT, function(name) {
        window.setTimeout(function() {
            self.emit('leavedMember', name);
        }, 0);
    });

    socket.on(NEW_MESSAGE_EVENT, function(message) {
        window.setTimeout(function() {
            self.emit('newMessage', message);
        }, 0);
    });

    socket.on(NEW_MESSAGES_EVENT, function(messages) {
        window.setTimeout(function() {
            self.emit('newMessages', messages);
        }, 0);
    });

    this.sendFriendRequestStatus = function(to, data) {
        socket.emit(FRIEND_STATUS_CHANGED_EVENT, {to_user: to, data: data});
    };

    socket.on(FRIEND_STATUS_CHANGED_EVENT, function(info) {
        window.setTimeout(function() {
            self.emit('friendRequestChanged', info);
        }, 0);
    });


    this.getOnlineStatus = function(usernames, done) {
        socket.emit(ONLINE_STATUS_EVENT, usernames, function(statuses) {
            window.setTimeout(function() {
                done(statuses);
            }, 0);
        });
    };
};
