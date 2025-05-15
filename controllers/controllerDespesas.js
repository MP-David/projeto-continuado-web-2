const db = require('../config/db_sequelize');

module.exports = {

    async getCreate(req, res) {
        try {

            console.log(req.body);
            const contas = await db.ContaBancaria.findAll({
                where: { id_usuario: req.user.id },
            });
            res.render('despesas/despesasCreate', {
                contas: contas.map(conta => conta.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar formulário de despesa');
        }
    },

    async postCreate(req, res) {
        try {
            await db.Despesas.create({
                id_usuario: req.user.id,
                id_conta: req.body.id_conta,
                descricao: req.body.descricao,
                valor: req.body.valor,
                date: req.body.date
            });
            res.redirect('/despesas/depesasList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao criar despesa');
        }
    },

    async getList(req, res) {
        try {
            const despesas = await db.Despesas.findAll({
                where: { id_usuario: req.user.id },
                include: [
                    { model: db.ContaBancaria, as: 'conta_bancaria' }
                ]
            });

            res.render('despesas/depesasList', {
                despesas: despesas.map(d => d.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao listar despesas');
        }
    }
};
