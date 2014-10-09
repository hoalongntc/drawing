module.exports = {
    db: {
        host: '127.0.0.1',
        port: 3306,
        name: 'name',
        user: 'user',
        pass: 'pass',
        log: false,
        dialect: 'mysql'
    },

    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 0,
        auth: null
    }
};