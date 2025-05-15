const db = require('../config/db_sequelize');

module.exports = {

    async getCreate(req, res) {
        res.render('conta_bancaria/contaCreate');
    },

    async postCreate(req, res) {
        try {
            await db.ContaBancaria.create({
                id_usuario: req.user.id,
                banco: req.body.banco,
                agencia: req.body.agencia,
                numero_conta: req.body.numero_conta,
                saldo: req.body.saldo
            });
            res.redirect('/contas/list');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao criar conta bancária');
        }
    },

    async getList(req, res) {
        try {
            const contas = await db.ContaBancaria.findAll({
                where: { id_usuario: req.user.id },
                include: [{ model: db.Despesas, as: 'despesas' }]
            });

            res.render('conta_bancaria/contaList', {
                contas: contas.map(c => c.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao listar contas');
        }
    }
};
