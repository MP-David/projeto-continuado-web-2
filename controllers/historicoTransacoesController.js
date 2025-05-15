const mongoose = require('mongoose');
const db_mongoose = require('../config/db_mongoose');
const historicoTransacoes = require('../models/noSql/historicoTransacoes');

mongoose.connect(db_mongoose.connection).then(() => {
    console.log('Conectado com o BD');
}).catch((err) => {
    console.error('Erro na conexão com o BD', err);
});

module.exports = {

    async getCreate(req, res) {
        res.render('historico/historicoCreate');
    },

    async postCreate(req, res) {
        try {
            const novoHistorico = new historicoTransacoes(req.body);
            await novoHistorico.save();
            res.redirect('/home');
        } catch (err) {
            console.error('Erro ao salvar histórico:', err);
            res.status(500).send('Erro ao salvar histórico');
        }
    },

    async getList(req, res) {
        try {
            const historicos = await historicoTransacoes.find();
            res.render('historico/historicoList', {
                historicos: historicos.map(h => h.toJSON())
            });
        } catch (err) {
            console.error('Erro ao buscar históricos:', err);
            res.status(500).send('Erro ao buscar históricos');
        }
    }
}
