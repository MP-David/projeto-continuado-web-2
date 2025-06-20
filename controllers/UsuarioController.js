const db = require('../config/db_sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

module.exports = {
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'noMenu.handlebars' });
    },
    async getLogout(req, res) {
        req.session.destroy();
        res.redirect('/');
    },
    async postLogin(req, res) {

        console.log('Conteúdo de req.body no postLogin:', req.body);

        const { login, senha } = req.body;

        if (!login || !senha) {
            console.error('Erro: Login ou senha ausentes em req.body');
            return res.status(400).send('Login e senha são obrigatórios');
        }

        try {

            const user = await db.Usuario.findOne({
                where: { login }
            });

            if (!user) {

                return res.status(404).send('Usuário ou senha incorretos');
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);

            if (!isPasswordValid) {

                return res.status(404).send('Usuário ou senha incorretos');
            }

            req.session.userId = user.id;
            req.session.login = req.body.login;
            req.session.tipo = user.tipo;
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
        try {

            const hashedPassword = await bcrypt.hash(req.body.senha, 10);

            await db.Usuario.create({
                login: req.body.login,
                senha: hashedPassword,
                nome: req.body.nome || null,
                email: req.body.email || null,
                data_nascimento: req.body.data_nascimento ? new Date(req.body.data_nascimento) : null,
                telefone: req.body.telefone || null,
            });
            res.redirect('/usuarios/list');
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).send('Erro ao criar usuário');
        }
    },
    async getList(req, res) {
        try {
            const usuarios = await db.Usuario.findAll();
            res.render('usuario/usuarioList', {
                usuarios: usuarios.map(user => user.toJSON())
            });
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).send('Erro ao buscar usuários');
        }
    },
    async getEdit(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.render('usuario/usuarioEdit', { usuario: usuario.toJSON() });
        } catch (err) {
            console.error('Erro ao carregar usuário:', err);
            res.status(500).send('Erro ao carregar usuário');
        }
    },
    async postEdit(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }

            let newPassword = req.body.senha;
            if (newPassword && newPassword.length > 0) {

                newPassword = await bcrypt.hash(newPassword, 10);
            } else {

                newPassword = usuario.senha;
            }

            await usuario.update({
                nome: req.body.nome,
                email: req.body.email,
                senha: newPassword,
                data_nascimento: req.body.data_nascimento ? new Date(req.body.data_nascimento) : null,
                telefone: req.body.telefone
            });

            res.redirect('/usuarios/list');
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            res.status(500).send('Erro ao atualizar usuário');
        }
    },
    async postDelete(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }

            await usuario.destroy();
            res.redirect('/usuarios/list');
        } catch (err) {
            console.error('Erro ao deletar usuário:', err);
            res.status(500).send('Erro ao deletar usuário');
        }
    }
};