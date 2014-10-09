module.exports = function(sequelize, DataTypes) {

    var crypto = require('crypto');

    return sequelize.define("Users", {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        fullname: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        sex: { type: DataTypes.STRING },
        birthday: { type: DataTypes.DATE },
        picture: { type: DataTypes.TEXT },

        type: { type: DataTypes.STRING },
        online: { type: DataTypes.BOOLEAN, defaultValue: false },

        passwordDigest: { type: DataTypes.STRING, allowNull: false },
        passwordSalt: { type: DataTypes.STRING, allowNull: false },

        createdAt: { type: DataTypes.BIGINT, defaultValue: Date.now() },
        updatedAt: { type: DataTypes.BIGINT, defaultValue: Date.now() }
    }, {
        tableName: 'users',
        timestamps: false,

        getterMethods: {
            password: function () {
                return this.getDataValue('passwordDigest');
            },

            salt: function () {
                return this.getDataValue('passwordSalt');
            }
        },
        setterMethods: {
            password: function (v) {
                if (v) {
                    var salt = Math.floor(Math.random() * 0x100000000);
                    salt = crypto.createHash('md5').update(salt.toString(16)).digest('hex');

                    this.setDataValue('passwordSalt', salt);
                    this.setDataValue('passwordDigest', crypto.createHash('md5').update(v + salt).digest('hex'));
                }
            },

            email: function (v) {
                if (v) this.setDataValue('email', v.toLowerCase().trim());
            }
        }
    })
};
