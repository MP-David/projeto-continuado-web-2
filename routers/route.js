const express = require('express');
const controllerUsuario = require('../controllers/UsuarioController');
const despesasController = require('../controllers/DespesasController');
const contaBancariaController = require('../controllers/ContaBancariaController');
const historicoTransacoesController = require('../controllers/HistoricoTransacoesController');
const route = express.Router();

// Home
route.get("/home", function (req, res) {
    res.render('home');
});

// Controller de Usuário
// Login e Recuperação de Senha
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);
route.get("/usuarios/create", controllerUsuario.getCreate);
route.post("/usuarios/create", controllerUsuario.postCreate);
route.get("/usuarios/list", controllerUsuario.getList);
route.get('usuarios/update/:id', controllerUsuario.getEdit);
route.post('usuarios/update/:id', controllerUsuario.postEdit);
route.post('usuarios/delete/:id', controllerUsuario.postDelete)

// Controller de Conta Bancária
route.get('/contas/create', contaBancariaController.getCreate);
route.post('/contas/create', contaBancariaController.postCreate);
route.get('/contas/list', contaBancariaController.getList);
route.get('/contas/update/:id', contaBancariaController.getUpdate);
route.post('/contas/update', contaBancariaController.postUpdate);
route.get('/contas/delete/:id', contaBancariaController.getDelete);

// Controller de Despesas
route.get('/despesas/create', despesasController.getCreate);
route.post('/despesas/create', despesasController.postCreate);
route.get('/despesas/list', despesasController.getList);
route.get('/despesas/update/:id', despesasController.getUpdate);
route.post('/despesas/update', despesasController.postUpdate);
route.get('/despesas/delete/:id', despesasController.getDelete);

// Controller de Histórico de Transações
route.get('/historico/create', historicoTransacoesController.getCreate);
route.post('/historico/create', historicoTransacoesController.postCreate);
route.get('/historico/list', historicoTransacoesController.getList);
route.get('/historico/update/:id', historicoTransacoesController.getUpdate);
route.post('/historico/update', historicoTransacoesController.postUpdate);
route.get('/historico/delete/:id', historicoTransacoesController.getDelete);

module.exports = route;
