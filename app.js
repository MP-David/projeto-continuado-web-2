const express = require('express');
const handlebars = require('express-handlebars');
const routes = require('./routers/route');
const db = require('./config/db_sequelize');
const middlewares = require('./middlewares/middlewares');
const session = require('express-session');
//var cookieParser = require('cookie-parser');
const app = express();

app.use(session({secret:'textosecreto',
    cookie:{maxAge: 30*60*1000}}));
//app.use(cookieParser());
app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await db.Usuario.findByPk(req.session.userId);
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
        } catch (err) {
            console.error('Erro ao carregar usuário da sessão:', err);
        }
    }
    next();
});

app.use(middlewares.logRegister,middlewares.sessionControl)
app.use(routes);

initDatabase();

async function initDatabase() {
    try {

        await db.sequelize.query('DROP SCHEMA public CASCADE');
        await db.sequelize.query('CREATE SCHEMA public');

        await db.sequelize.sync({ force: true });

        await db.Usuario.create({
            id: 100,
            nome: 'admin',
            login: 'admin',
            email: 'admin2@mail.com',
            senha: '123',
            telefone: '454545',
            data_nascimento: new Date(),
            tipo: 1
        });

        await db.Usuario.sync();
        console.log("Tabela de usuários sincronizada");

        await db.ContaBancaria.sync();
        console.log("Tabela de contas bancárias sincronizada");

        await db.Despesas.sync();
        await db.Receita.sync();
        console.log("Tabelas de transações sincronizadas");

        console.log("Banco de dados sincronizado com sucesso");

        app.listen(8081, function() {
            console.log("Servidor no http://localhost:8081");
        });
    } catch (error) {
        console.error("Erro ao sincronizar o banco:", error);
    }
}