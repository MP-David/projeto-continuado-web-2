module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.BIGINT, autoIncrement: true, allowNull: false, primaryKey: true
        },
        login: {
            type: Sequelize.STRING, allowNull: false, unique: true
        },
        nome: {
            type: Sequelize.STRING, allowNull: true
        },
        email: {
            type: Sequelize.STRING, allowNull: true, unique: true, validate: {isEmail: true}
        },
        senha: {
            type: Sequelize.STRING, allowNull: false
        },
        data_nascimento: {
            type: Sequelize.DATE, allowNull: true
        },
        telefone: {
            type: Sequelize.STRING, allowNull: true
        },
        tipo: {
            type: Sequelize.INTEGER, allowNull: true
        }
    }, {
        tableName: 'usuario',
        underscored: true
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.ContaBancaria, {
            foreignKey: 'id_usuario',
            as: 'conta_bancaria'
        });

        Usuario.hasMany(models.Despesas, {
            foreignKey: 'id_usuario',
            as: 'despesas'
        });

        Usuario.hasMany(models.Receita, {
            foreignKey: 'id_usuario',
            as: 'receita'
        })
    };

    return Usuario;
};