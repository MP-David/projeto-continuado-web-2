const express = require('express');
const handlebars = require('express-handlebars');
const { route, apiRoute } = require('./routers/route');
const db = require('./config/db_sequelize');
const middlewares = require('./middlewares/middlewares');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiRoute);

app.use(session({
    secret: 'textosecreto',
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false,
    saveUninitialized: false
}));

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

app.use(middlewares.logRegister, middlewares.sessionControl);

app.use(route);

initDatabase();

async function initDatabase() {
    try {
        // await db.sequelize.query('DROP SCHEMA public CASCADE');
        // await db.sequelize.query('CREATE SCHEMA public');

        await db.sequelize.sync({ force: false });

        const existingAdmin = await db.Usuario.findByPk(100);
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('123', 10);
            await db.Usuario.create({
                id: 100,
                nome: 'admin',
                login: 'admin',
                email: 'admin2@mail.com',
                senha: hashedPassword,
                telefone: '454545',
                data_nascimento: new Date(),
                tipo: 1
            });
        }

        console.log("Banco de dados sincronizado com sucesso");

        app.listen(8081, function() {
            console.log("Servidor rodando em http://localhost:8081");
        });
    } catch (error) {
        console.error("Erro ao sincronizar o banco:", error);
    }
}