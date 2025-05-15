const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://admin:admin123@localhost:5432/meu_banco', {
    dialect: 'postgres',
    logging: false
});

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Usuario = require('../models/relational/usuario.js')(sequelize, Sequelize);
db.ContaBancaria = require('../models/relational/conta_bancaria.js')(sequelize, Sequelize);
db.Despesas = require('../models/relational/despesas')(sequelize, Sequelize);
db.Receita = require('../models/relational/receita')(sequelize, Sequelize);

// Cria as associações
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate && typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

module.exports = db;