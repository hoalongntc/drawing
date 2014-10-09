module.exports = function() {
    var express = require('express');
    var router = express.Router();
    var async = require('async');
    var DB = require('../models');

    router.get('/my', function(req, res) {
         DB.Users
             .find({where: {id: req.user.id}}, {raw: true})
             .success(function(user) {
                 if(!user) return res.status(404).end();

                 DB.Friends
                     .findAll({where: DB.Sequelize.or({ userId: user.id }, { friendId: user.id })
                     , include: [
                         {model: DB.Users, as: 'User1', foreignKey: 'userId', attributes: ['username']},
                         {model: DB.Users, as: 'User2', foreignKey: 'friendId', attributes: ['username']}
                     ], attributes: ['verified']}, {raw: true})
                     .success(function(friends) {
                         res.json(friends);
                     })
                     .error(function(err) {
                         console.log(err);
                         res.status(500).send(err.code);
                     });
             })
             .error(function(err) {
                 console.log(err);
                 res.status(500).send(err.code);
             });
    });

    router.get('/:username/status', function(req, res) {
        var friend = null;
        async.series([
            function(done) {
                DB.Users
                    .find({where: {username: req.params.username}}, {raw: true})
                    .success(function(_friend) {
                        if(!_friend) return done({message: 'User ' + req.params.username + ' is not existed'});
                        friend = _friend;
                        done();
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    })
            },
            function(done) {
                DB.Friends
                    .find({where: DB.Sequelize.or({ userId: req.user.id, friendId: friend.id }, { userId: friend.id, friendId: req.user.id })
                        , include: [ {model: DB.Users, as: 'User1', foreignKey: 'userId', attributes: ['username']} ]
                        , attributes: ['verified']}, {raw: true})
                    .success(function(request) {
                        if(!request) {
                            res.status(200).send({isFriend: false});
                            done();
                        } else {
                            res.status(200).send({isFriend: true, isVerified: !!request.verified, friendRequestFrom: request['User1'].username});
                            done();
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    });
            }
        ], function(err) {
            if(err) res.status(500).send(err);

        });
    });

    router.post('/:username/request', function(req, res) {
        var friend = null;
        async.series([
            function(done) {
                DB.Users
                    .find({where: {username: req.params.username}}, {raw: true})
                    .success(function(_friend) {
                        if(!_friend) return done({message: 'User ' + req.params.username + ' is not existed'});
                        friend = _friend;
                        done();
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    })
            },
            function(done) {
                DB.Friends
                    .find({where: DB.Sequelize.or({ userId: req.user.id, friendId: friend.id }, { userId: friend.id, friendId: req.user.id })
                        , include: [
                            {model: DB.Users, as: 'User1', foreignKey: 'userId', attributes: ['username']},
                            {model: DB.Users, as: 'User2', foreignKey: 'friendId', attributes: ['username']}
                        ]}, {raw: true})
                    .success(function(request) {
                        if(!request) {
                            // Make friend request
                            DB.Friends
                                .create({userId: req.user.id, friendId: friend.id, verified: false})
                                .success(function() {
                                    done();
                                })
                                .error(function(err) {
                                    console.log(err);
                                    done({message: err.code});
                                });
                        } else if(request.verified) {
                            done({message: "Already are friends"});
                        } else {
                            done({message: "Already requested"});
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    });
            }
        ], function(err) {
            if(!err) return res.status(200).send(friend.fullname);
            res.status(500).send(err);
        });
    });

    router.post('/:username/accept', function(req, res) {
        var friend = null;
        async.series([
            function(done) {
                DB.Users
                    .find({where: {username: req.params.username}}, {raw: true})
                    .success(function(_friend) {
                        if(!_friend) return done({message: 'User ' + req.params.username + ' is not existed'});
                        friend = _friend;
                        done();
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    })
            },
            function(done) {
                DB.Friends
                    .find({where: DB.Sequelize.or({ userId: req.user.id, friendId: friend.id }, { userId: friend.id, friendId: req.user.id })
                        , include: [
                            {model: DB.Users, as: 'User1', foreignKey: 'userId', attributes: ['username']},
                            {model: DB.Users, as: 'User2', foreignKey: 'friendId', attributes: ['username']}
                        ]})
                    .success(function(request) {
                        if(!request) {
                            done({message: "There is no friend request"});
                        } else if(request.verified) {
                            done({message: "Already are friends"});
                        } else {
                            request.verified = true;
                            request
                                .save()
                                .success(function() {
                                    done();
                                })
                                .error(function(err) {
                                    console.log(err);
                                    done({message: err.code});
                                })
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    });
            }
        ], function(err) {
            if(!err) return res.status(200).send(friend.fullname);
            res.status(500).send(err);
        });
    });

    router.post('/:username/reject', function(req, res) {
        var friend = null;
        async.series([
            function(done) {
                DB.Users
                    .find({where: {username: req.params.username}}, {raw: true})
                    .success(function(_friend) {
                        if(!_friend) return done({message: 'User ' + req.params.username + ' is not existed'});
                        friend = _friend;
                        done();
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    })
            },
            function(done) {
                DB.Friends
                    .find({where: DB.Sequelize.or({ userId: req.user.id, friendId: friend.id }, { userId: friend.id, friendId: req.user.id })
                        , include: [
                            {model: DB.Users, as: 'User1', foreignKey: 'userId', attributes: ['username']},
                            {model: DB.Users, as: 'User2', foreignKey: 'friendId', attributes: ['username']}
                        ]})
                    .success(function(request) {
                        if(!request) {
                            done({message: "There is no friend request"});
                        } else {

                            request
                                .destroy()
                                .success(function() {
                                    done();
                                })
                                .error(function(err) {
                                    console.log(err);
                                    done({message: err.code});
                                })
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                        done({message: err.code});
                    });
            }
        ], function(err) {
            if(!err) return res.status(200).send(friend.fullname);
            res.status(500).send(err);
        });
    });

    router.get('/:username/search', function(req, res) {
        var sql = 'SELECT `username`, `fullname`, `type`, `picture` FROM `users` WHERE id NOT IN (' +
                    'SELECT DISTINCT `userId` FROM `friends` WHERE `friendId` = ? ' +
                    'UNION ' +
                    'SELECT DISTINCT `friendId` FROM `friends` WHERE `userId` = ?' +
                ') AND id != ? AND (`username` LIKE ? OR `fullname` LIKE ?) LIMIT 0, 10';

        DB.sequelize
            .query(sql, null, {raw: true}, [req.user.id, req.user.id, req.user.id, '%' + req.params.username + '%', '%' + req.params.username + '%'])
            .success(function(rows) {
                res.status(200).send(rows);
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send({message: err.code});
            });
    });

    return router;
};