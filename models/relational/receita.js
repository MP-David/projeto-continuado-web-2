
module.exports = (sequelize, Sequelize) => {
    const Receita = sequelize.define('receita', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        id_usuario: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id',
            }
        },
        id_conta: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: 'conta_bancaria',
                key: 'id',
            }
        },
        descricao: {
            type: Sequelize.STRING, allowNull: false,
        },
        valor: {
            type: Sequelize.DECIMAL(15, 2), allowNull: false,
        },
        date: {
            type: Sequelize.DATE, allowNull: false,
        }
    }, {
        tableName: 'receita',
        underscored: true,
    })

    Receita.associate = (models) => {
        Receita.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario',
            as: 'usuario',
        })
        Receita.belongsTo(models.ContaBancaria, {
            foreignKey: 'id_conta',
            as: 'conta_bancaria',
        })
    }

    return Receita;
}