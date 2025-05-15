const express = require('express');
const controllerUsuario = require('../controllers/controllerUsuario');
const despesasController = require('../controllers/controllerDespesas');
const contaBancariaController = require('../controllers/contaBancariaController');
const historicoTransacoesController = require('../controllers/historicoTransacoesController');
const route = express.Router();

// Home
route.get("/home", function (req, res) {
    res.render('home');
});

// Controller de Usuário
// Login e Recuperação de Senha
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);

// CRUD de Usuários
route.get("/usuarios/create", controllerUsuario.getCreate);
route.post("/usuarios/create", controllerUsuario.postCreate);
route.get("/usuarios/list", controllerUsuario.getList);

// Controller de Conta Bancária
route.get('/contas/create', contaBancariaController.getCreate);
route.post('/contas/create', contaBancariaController.postCreate);
route.get('/contas/list', contaBancariaController.getList);

// Controller de Despesas
route.get('/despesas/create', despesasController.getCreate);
route.post('/despesas/create', despesasController.postCreate);
route.get('/despesas/list', despesasController.getList);
route.get('/despesas/depesasList', despesasController.getList);

// Controller HistoricoTransacoes
route.get('/historico/create', historicoTransacoesController.getCreate);
route.post('/historico/create', historicoTransacoesController.postCreate);
route.get('/historico/list', historicoTransacoesController.getList);

module.exports = route;
