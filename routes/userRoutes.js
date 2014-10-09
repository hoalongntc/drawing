module.exports = function() {
    var express = require('express');
    var router = express.Router();
    var crypto = require('crypto');
    var DB = require('../models');

    router.get('/me', function(req, res) {
        DB.Users
            .find({where: {username: req.user.username}}, {raw: true})
            .success(function(user) {
                if(!user) return res.status(404).end();
                delete user.passwordDigest;
                delete user.passwordSalt;
                delete user.password;
                delete user.salt;

                res.json(user);
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err.code);
            });
    });

    router.get('/:username', function(req, res) {
         DB.Users
             .find({where: {username: req.params.username}}, {raw: true})
             .success(function(user) {
                 if(!user) return res.status(404).end();
                 delete user.passwordDigest;
                 delete user.passwordSalt;
                 delete user.password;
                 delete user.salt;

                 res.json(user);
             })
             .error(function(err) {
                 console.log(err);
                 res.status(500).send(err.code);
             });
    });

    router.post('/exists', function(req, res) {
        var data = req.body;
        if(!data.username) return res.status(404).end();

        DB.Users
            .find({where: {username: data.username}}, {raw: true})
            .success(function(user) {
                if(!user) return res.status(404).end();
                res.status(200).send();
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err.code);
            });
    });

    router.post('/', function(req, res) {
        var data = req.body;
        if(!data.username) return res.status(403).send({message: "Username is required"});
        if(!data.password) return res.status(403).send({message: "Password is required"});

        data.type = 'normal';

        DB.Users
            .create(data)
            .success(function(user) {
                var _user = user.dataValues;
                delete _user.passwordDigest;
                delete _user.passwordSalt;
                delete _user.password;
                delete _user.salt;

                res.json(_user);
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err.code);
            });
    });

    router.post('/fb', function(req, res) {
        var data = req.body;
        console.log(data);
        if(!data.id) res.status(403).send({message: "Invalid facebook info"});
        if(!data.name) res.status(403).send({message: "Invalid facebook info"});

        var _data = {
            username: data.id,
            password: data.id,
            fullname: data.name,
            type: 'fb'
        };

        DB.Users
            .create(_data)
            .success(function(user) {
                var _user = user.dataValues;
                delete _user.passwordDigest;
                delete _user.passwordSalt;
                delete _user.password;
                delete _user.salt;

                res.json(_user);
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err.code);
            });
    });

    router.post('/gp', function(req, res) {
        var data = req.body;
        console.log(data);
        if(!data.id) res.status(403).send({message: "Invalid google info"});
        if(!data.name) res.status(403).send({message: "Invalid google info"});

        var _data = {
            username: data.id,
            password: data.id,
            fullname: data.name.familyName + ' ' + data.name.givenName,
            sex: data.gender,
            type: 'gp'
        };

        DB.Users
            .create(_data)
            .success(function(user) {
                var _user = user.dataValues;
                delete _user.passwordDigest;
                delete _user.passwordSalt;
                delete _user.password;
                delete _user.salt;

                res.json(_user);
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err.code);
            });
    });

    router.post('/status', function(req, res) {
        var data = req.body;
        console.log(data);


    });

    router.post('/:id', function(req, res) {
        var data = req.body;
        if(!data.username) return res.status(403).send({message: "Username is required"});
        if(!data.passwordOld) return res.status(403).send({message: "Current password is required"});

        DB.Users
            .find({where: {id: req.params.id}})
            .success(function(user) {
                if(!user) return res.status(404).end();

                var pass = crypto.createHash('md5').update(data.passwordOld + user.passwordSalt).digest('hex');
                if(user.password != pass) return res.status(403).send({message: "Current password is incorrect"});

                if(data.password) user.password = data.password;
                if(data.fullname) user.fullname = data.fullname;
                if(data.picture) user.picture = data.picture;

                user
                    .save()
                    .success(function(user) {
                        var _user = user.dataValues;
                        delete _user.passwordDigest;
                        delete _user.passwordSalt;
                        delete _user.password;
                        delete _user.salt;

                        res.json(_user);
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

    return router;
};