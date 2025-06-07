const express = require('express');
const controllerUsuario = require('../controllers/UsuarioController');
const despesasController = require('../controllers/DespesasController');
const contaBancariaController = require('../controllers/ContaBancariaController');
const historicoTransacoesController = require('../controllers/HistoricoTransacoesController');
const authController = require('../controllers/AuthController');

const route = express.Router();
const apiRoute = express.Router();

route.get("/home", function (req, res) {
    res.render('home');
});

// Rotas para as Views de Usuário
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);
route.get("/usuarios/create", controllerUsuario.getCreate);
route.post("/usuarios/create", controllerUsuario.postCreate);
route.get("/usuarios/list", controllerUsuario.getList);
route.get('/usuarios/update/:id', controllerUsuario.getEdit);
route.post('/usuarios/update/:id', controllerUsuario.postEdit);
route.post('/usuarios/delete/:id', controllerUsuario.postDelete);

// Rotas para as Views de Conta Bancária
route.get('/contas/create', contaBancariaController.getCreate);
route.post('/contas/create', contaBancariaController.postCreate);
route.get('/contas/list', contaBancariaController.getList);
route.get('/contas/update/:id', contaBancariaController.getUpdate);
route.post('/contas/update', contaBancariaController.postUpdate);
route.get('/contas/delete/:id', contaBancariaController.getDelete);

// Rotas para as Views de Despesas
route.get('/despesas/create', despesasController.getCreate);
route.post('/despesas/create', despesasController.postCreate);
route.get('/despesas/list', despesasController.getList);
route.get('/despesas/update/:id', despesasController.getUpdate);
route.post('/despesas/update', despesasController.postUpdate);
route.get('/despesas/delete/:id', despesasController.getDelete);

// Rotas para as Views de Histórico de Transações
route.get('/historico/create', historicoTransacoesController.getCreate);
route.post('/historico/create', historicoTransacoesController.postCreate);
route.get('/historico/list', historicoTransacoesController.getList);
route.get('/historico/update/:id', historicoTransacoesController.getUpdate);
route.post('/historico/update', historicoTransacoesController.postUpdate);
route.get('/historico/delete/:id', historicoTransacoesController.getDelete);

apiRoute.post('/auth/login', authController.login);

// Rotas da API de Despesas (protegidas com o middleware 'authController.verifyToken')
apiRoute.get('/despesas', authController.verifyToken, despesasController.getExpenses);
apiRoute.get('/despesas/:id', authController.verifyToken, despesasController.getExpenseById);
apiRoute.post('/despesas', authController.verifyToken, despesasController.createExpense);
apiRoute.put('/despesas/:id', authController.verifyToken, despesasController.updateExpense);
apiRoute.delete('/despesas/:id', authController.verifyToken, despesasController.deleteExpense);

module.exports = { route, apiRoute };