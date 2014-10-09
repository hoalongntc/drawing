module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Friends", {

        userId: { type: DataTypes.INTEGER, allowNull: false, unique: 'friendUnique', references: "Users", referencesKey: "id" },
        friendId: { type: DataTypes.INTEGER, allowNull: false, unique: 'friendUnique', references: "Users", referencesKey: "id" },

        verified: { type: DataTypes.BOOLEAN, defaultValue: false },

        createdAt: { type: DataTypes.BIGINT, defaultValue: Date.now() },
        updatedAt: { type: DataTypes.BIGINT, defaultValue: Date.now() }
    }, {
        tableName: 'friends',
        timestamps: false
    })
};
