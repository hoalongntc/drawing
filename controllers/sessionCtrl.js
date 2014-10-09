module.exports = function(redisClient) {
    return function(req, res, next) {
        if(/^\/(login(Social)?|user(\/exists|\/fb|\/gp)?)?$/g.test(req.path)) return next();

        var session = req.cookies.session;
        if(!session) return res.status(403).end();

        redisClient.get('session:' + session, function(err, userStr) {
            if(err) {
                console.log(err);
                return res.status(500).end();
            }
            if(!userStr) return res.status(403).end();

            req.user = JSON.parse(userStr);
            next();
        });
    }
};