module.exports = (sequelize, Sequelize) => {
    const ContaBancaria = sequelize.define('conta_bancaria', {
        id: {
            type: Sequelize.BIGINT, autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_usuario: {
            type: Sequelize.BIGINT, allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        banco: {
            type: Sequelize.STRING, allowNull: false
        },
        agencia: {
            type: Sequelize.STRING, allowNull: false
        },
        numero_conta: {
            type: Sequelize.STRING, allowNull: false
        },
        saldo: {
            type: Sequelize.DECIMAL(15, 2), allowNull: false
        }
    }, {
        tableName: 'conta_bancaria',
        underscored: true
    });

    ContaBancaria.associate = (models) => {
        ContaBancaria.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario',
            as: 'usuario'
        });

        ContaBancaria.hasMany(models.Despesas, {
            foreignKey: 'id_conta',
            as: 'despesas'
        });

        ContaBancaria.hasMany(models.Receita, {
            foreignKey: 'id_conta',
            as: 'receita'
        })
    };

    return ContaBancaria;
};