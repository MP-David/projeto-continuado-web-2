    const db = require('../config/db_sequelize');
    const path = require('path');

    module.exports = {

        async getLogin(req, res) {
            res.render('usuario/login', { layout: 'noMenu.handlebars' });
        },
        async postLogin(req, res) {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return res.status(400).send('Login e senha são obrigatórios');
            }

            try {
                const user = await db.Usuario.findOne({
                    where: { login, senha }
                });

                if (!user) {
                    return res.status(404).send('Usuário ou senha incorretos');
                }

                // Salva o id do usuário na sessão
                req.session.userId = user.id;
                req.user = user;

                res.redirect('/home');
            } catch (err) {
                console.error('Erro ao autenticar o usuário:', err);
                res.status(500).send('Erro interno no servidor');
            }
        },
        async getCreate(req, res) {
            res.render('usuario/usuarioCreate');
        },
        async postCreate(req, res) {
            db.Usuario.create({
                login:req.body.login,
                senha:req.body.senha
                }).then(() => {
                    res.redirect('/home');
                }).catch((err) => {
                    console.log(err);
                });
        },
        async getList(req, res) {
            db.Usuario.findAll().then (usuarios => {
                res.render('usuario/usuarioList', {usuarios: usuarios.map(user => user.toJSON())});
            }).catch((err) => {
                console.log(err);
            });
        }
    }   