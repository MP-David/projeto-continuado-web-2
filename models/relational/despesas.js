
module.exports = (sequelize, Sequelize) => {
    const Despesas = sequelize.define('despesas', {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        id_usuario: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        id_conta: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: 'conta_bancaria',
                key: 'id'
            }
        },
        descricao: {
            type: Sequelize.STRING,
            allowNull: false
        },
        valor: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: false
        },
        date: {
            type: Sequelize.DATE, allowNull: false,
        },
    }, {
        tableName: 'despesas',
        underscored: true
    });

    Despesas.associate = (models) => {
        Despesas.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario',
            as: 'usuario'
        });

        Despesas.belongsTo(models.ContaBancaria, {
            foreignKey: 'id_conta',
            as: 'conta_bancaria'
        });
    };

    return Despesas;
};