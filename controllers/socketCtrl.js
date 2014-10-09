module.exports = function(io) {
    var sockets = { __maps: {}, __groups: {} };
    var events = ['drawing_new_brush', 'drawing_new_image', 'drawing_new_message', 'drawing_new_messages', 'drawing_friend_request_changed'];

    function randomString(length, chars) {
        if(length < 1) return '';
        var cs = chars || '0123456789ABCDEF';
        var randomString = '';

        for (var i = 0; i < length; i++) {
            var randomPoz = Math.floor(Math.random() * cs.length);
            randomString += cs.substring(randomPoz, randomPoz + 1);
        }

        return randomString;
    }

    function broadcastToUser(from, username, event, data) {
        if(username in sockets) {
            for(var id in sockets[username]) {
                if(sockets[username].hasOwnProperty(id) && id != from) {
                    sockets[username][id].instance.emit(event, data);
                }
            }
        }
    }

    function broadcastToSharedGroup(from, shared_key, event, data) {
        if(shared_key in sockets.__groups) {
            for(var id in sockets.__groups[shared_key]) {
                if(sockets.__groups[shared_key].hasOwnProperty(id) && id != 'count' && id != 'master' && id != from) {
                    var username = sockets.__maps[id];
                    if(username) sockets[username][id].instance.emit(event, data);
                }
            }
        }
    }

    function removeSocketFromGroup(socket_id) {
        var username = sockets.__maps[socket_id];
        if(!username) return false;

        var shared_key = sockets[username][socket_id].sharing_key;
        if(shared_key && shared_key in sockets.__groups && socket_id in sockets.__groups[shared_key]) {
            var isMaster = sockets.__groups[shared_key][socket_id].master;

            sockets[username][socket_id].sharing_key = null;
            delete sockets.__groups[shared_key][socket_id];
            sockets.__groups[shared_key].count -= 1;
            if(sockets.__groups[shared_key].count <= 0) delete sockets.__groups[shared_key];
            else if(isMaster) {
                for(var id in sockets.__groups[shared_key]) {
                    if(sockets.__groups[shared_key].hasOwnProperty(id) && id != 'count' && id != 'master') {
                        var masterName = sockets.__maps[id];
                        if(!masterName) continue; //?

                        console.log('Change master of %s from %s to %s', shared_key, socket_id, masterName, username);
                        sockets.__groups[shared_key][id].master = 1; // Change master
                        sockets.__groups[shared_key].master = id;
                        broadcastToSharedGroup(socket_id, shared_key, 'drawing_new_master', masterName);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function getGroupInfo(shared_key) {
        if(shared_key in sockets.__groups) {
            var res = [];
            for(var id in sockets.__groups[shared_key]) {
                if(sockets.__groups[shared_key].hasOwnProperty(id) && id != 'count' && id != 'master') {
                    var username = sockets.__maps[id];
                    if(!username) continue;
                    if(id in sockets[username]) res.push(sockets.__maps[id]);
                }
            }

            return res;
        } else return null;
    }

    function dump() {}
    
    io.sockets.on('connection', function (socket) {
        console.log('Client %s connected', socket.id);

        socket.on('drawing_identify', function(info, done) {
            done = done || dump;

            if(!info || !info.username) return done(false);

            console.log('Client %s identified as', socket.id, info.fullname);

            sockets.__maps[socket.id] = info.username; // Map
            if(!(info.username in sockets)) sockets[info.username] = { };
            sockets[info.username][socket.id] = { instance: socket, sharing_key: null };

            console.log(sockets);
            done();
        });

        socket.on('drawing_un_identify', function() {
            var username = sockets.__maps[socket.id];
            if(!username) return; // Not identified

            console.log('Client %s call un identify', username);

            removeSocketFromGroup(socket.id);
            delete sockets[username][socket.id];
            delete sockets.__maps[socket.id];

            for(var key in sockets[username]) {
                if(sockets[username].hasOwnProperty(key)) return;
            }

            delete sockets[username];
            console.log(sockets);
        });

        socket.on('drawing_start_sharing', function(data, done) {
            done = done || dump;

            var username = sockets.__maps[socket.id];
            if(!username) return done(false); // Not identified

            var shared_key = sockets[username][socket.id].sharing_key;
            if(shared_key && shared_key in sockets.__groups) return done(shared_key);
            else {
                if(/^[0-9A-F]{8}$/.test(data)) {
                    shared_key = data;
                } else {
                    shared_key = randomString(8, '0123456789ABCDEF');
                    while(shared_key in sockets.__groups)
                        shared_key = randomString(8, '0123456789ABCDEF');
                }

                sockets[username][socket.id].sharing_key = shared_key;
                sockets.__groups[shared_key] = { count: 1, master: socket.id };
                sockets.__groups[shared_key][socket.id] = { master: 1 };
                done(shared_key);
                console.log('Client %s created sharing key %s', username, shared_key);
            }

            console.log(sockets);
        });

        socket.on('drawing_join_shared', function(shared_key, done) {
            done = done || dump;

            var username = sockets.__maps[socket.id];
            if(!username) return done({message: "Not identified"});

            if(shared_key && shared_key in sockets.__groups) {
                sockets[username][socket.id].sharing_key = shared_key;
                if(!(socket.id in sockets.__groups[shared_key]))
                    sockets.__groups[shared_key].count++;

                sockets.__groups[shared_key][socket.id] = { master: 0 };
                broadcastToSharedGroup(socket.id, shared_key, 'drawing_new_member', username);
                done();
            } else done({message: "Sharing group not exists"});

            console.log(sockets);
        });

        socket.on('drawing_leave_shared', function(done) {
            done = done || dump;

            var username = sockets.__maps[socket.id];
            if(!username) return done({message: "Not identified"});

            console.log('Client %s request to leave shared group', username);

            var shared_key = sockets[username][socket.id].sharing_key;
            console.log(sockets);
            console.log(shared_key);

            if(!shared_key) return done({message: 'Not in any sharing group'});
            if(!(shared_key in sockets.__groups)) return done({message: 'Sharing group not exists'});

            broadcastToSharedGroup(socket.id, shared_key, 'drawing_leaving_member', username);
            removeSocketFromGroup(socket.id);
            done();

            console.log(sockets);
        });

        socket.on('drawing_group_info', function(shared_key, done) {
            done = done || dump;
            done(getGroupInfo(shared_key));
        });

        socket.on('drawing_give_me_init_image', function(data, done) {
            done = done || dump;

            var username = sockets.__maps[socket.id];
            if(!username) return done({message: "Not identified"});

            console.log('Client %s request init image', username);

            var shared_key = sockets[username][socket.id].sharing_key;
            if(!shared_key) return done({message: 'Not in any sharing group'});
            if(!(shared_key in sockets.__groups)) return done({message: 'Sharing group not exists'});

            var masterId = sockets.__groups[shared_key].master;
            var masterName = sockets.__maps[masterId];
            if(masterName in sockets && masterId in sockets[masterName]) {
                console.log('Call %s master of %s send init image', masterName, shared_key);
                sockets[masterName][masterId].instance.emit('drawing_give_me_init_image', username, function(initImage) {
                    socket.emit('drawing_here_ur_init_image', initImage);
                });
            }
        });

        socket.on('drawing_give_me_init_messages', function(data, done) {
            done = done || dump;

            var username = sockets.__maps[socket.id];
            if(!username) return done({message: "Not identified"});

            console.log('Client %s request init messages', username);

            var shared_key = sockets[username][socket.id].sharing_key;
            if(!shared_key) return done({message: 'Not in any sharing group'});
            if(!(shared_key in sockets.__groups)) return done({message: 'Sharing group not exists'});

            var masterId = sockets.__groups[shared_key].master;
            var masterName = sockets.__maps[masterId];
            if(masterName && masterId in sockets[masterName]) {
                console.log('Call %s master of %s send init messages', masterName, shared_key);
                sockets[masterName][masterId].instance.emit('drawing_give_me_init_messages', username, function(messages) {
                    socket.emit('drawing_here_ur_init_messages', messages);
                });
            }
        });

        socket.on('drawing_online_status', function(usernames, done) {
            done = done || dump;
            if(!usernames) done(null);
            if(!Array.isArray(usernames)) done(false);
            var res = {};
            for(var i = 0; i < usernames.length; i++)
                res[usernames[i]] = (usernames[i] in sockets);

            done(res);
        });
        
        socket.on('disconnect', function() {
            var username = sockets.__maps[socket.id];
            if(!username) return;

            console.log('Client %s disconnected', username);

            if(username in sockets && socket.id in sockets[username]) {
                var shared_key = sockets[username][socket.id].sharing_key;
                if(shared_key && shared_key in sockets.__groups)
                    broadcastToSharedGroup(socket.id, shared_key, 'drawing_leaving_member', username);

                removeSocketFromGroup(socket.id);

                delete sockets.__maps[socket.id];
                delete sockets[username][socket.id];
                for(var key in sockets[username]) {
                    if(sockets[username].hasOwnProperty(key)) return;
                }
                delete sockets[username];
                console.log(sockets);
            }
        });

        events.forEach(function(event) {
            socket.on(event, function(data) {
                if(!data.to_sharing_key && !data.to_user) return;

                if(data.to_sharing_key && data.to_sharing_key in sockets.__groups) {
                    console.log('Fire %s to sharing group %s', event, data.to_sharing_key);
                    broadcastToSharedGroup(socket.id, data.to_sharing_key, event, data.data);
                } else if(data.to_user && data.to_user in sockets) {
                    console.log('Fire %s to user %s', event, data.to_user);
                    broadcastToUser(socket.id, data.to_user, event, data.data);
                }
            });
        });
    });
};
