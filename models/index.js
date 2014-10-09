var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash'),
    config = require('config'),

    sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
        host: config.db.host,
        dialect: config.db.dialect || 'mysql',
        port: config.db.port || 3306,
        logging: config.db.log ? console.log : false
    }),
    db = { };

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.js') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);

(function (DB) {
    // Define relationships
    DB.Friends.belongsTo(DB.Users, {as: 'User1', foreignKey: 'userId'});
    DB.Friends.belongsTo(DB.Users, {as: 'User2', foreignKey: 'friendId'});
})(module.exports);