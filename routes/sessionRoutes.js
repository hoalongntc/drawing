module.exports = function(redisClient) {
    var express = require('express');
    var router = express.Router();
    var DB = require('../models');
    var crypto = require('crypto');

    router.post('/login', function(req, res) {
        if(!req.body.username) return res.status(403).send({message: "Username is required"});
        if(!req.body.password) return res.status(403).send({message: "Password is required"});

        DB.Users
            .find({where: {username: req.body.username}})
            .success(function(user) {
                if(!user) return res.status(403).send({message: "Username or password is invalid"});

                var pass = crypto.createHash('md5').update(req.body.password + user.passwordSalt).digest('hex');
                if(pass != user.passwordDigest) return res.status(403).send({message: "Username or password is invalid"});

                //Save session
                //Set cookie (3days)
                var session = crypto.createHash('md5').update((Math.random() * 1000000000).toString(16)).digest('hex');
                var _user = user.dataValues;
                delete _user.passwordDigest;
                delete _user.passwordSalt;
                delete _user.password;
                delete _user.salt;

                redisClient
                    .multi()
                    .set('session:' + session, JSON.stringify(_user))
                    .expire('session:' + session, 259200000)
                    .exec(function(err) {
                        if(err) return res.status(500).send(err);

                        res.cookie('session', session, { expires: new Date(Date.now() + 259200000), httpOnly: true });
                        res.json(_user);
                    });
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
    });

    router.post('/loginSocial', function(req, res) {
        console.log(req.body);
        if(!req.body.id) return res.status(403).send({message: "Invalid social account info"});

        console.log('ok 1');
        DB.Users
            .find({where: {username: req.body.id}})
            .success(function(user) {
                console.log('ok 2');
                if(!user) return res.status(403).send({message: "Facebook account not connected"});
                console.log('ok 3');
                //Save session
                //Set cookie (3days)
                var session = crypto.createHash('md5').update((Math.random() * 1000000000).toString(16)).digest('hex');
                var _user = user.dataValues;
                delete _user.passwordDigest;
                delete _user.passwordSalt;
                delete _user.password;
                delete _user.salt;

                redisClient
                    .multi()
                    .set('session:' + session, JSON.stringify(_user))
                    .expire('session:' + session, 864000) // 10 days
                    .exec(function(err) {
                        if(err) return res.status(500).send(err);

                        res.cookie('session', session, { expires: new Date(Date.now() + 864000000), httpOnly: true });
                        res.json(_user);
                    });
            })
            .error(function(err) {
                console.log(err);
                res.status(500).send(err);
            });
    });

    router.get('/login', function(req, res) {
        res.redirect('/app/login.html');
    });

    router.get('/logout', function(req, res) {
        var session = req.cookies.session;

        redisClient.del('session:' + session, function(err) {
            if(err) return res.status(500).send(err);

            res.clearCookie('session', {});
            res.status(200).end();
        });
    });

    return router;
};
