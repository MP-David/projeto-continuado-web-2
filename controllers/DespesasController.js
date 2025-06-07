const db = require('../config/db_sequelize');
const authController = require('./AuthController');

module.exports = {

    async getCreate(req, res) {
        try {
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
            res.redirect('/despesas/despesasList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao criar despesa via formulário');
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

            res.render('despesas/despesasList', {
                despesas: despesas.map(d => d.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao listar despesas para view');
        }
    },

    async getUpdate(req, res) {
        try {
            const despesa = await db.Despesas.findByPk(req.params.id);
            if (!despesa || despesa.id_usuario !== req.user.id) {
                return res.status(404).send('Despesa não encontrada ou acesso negado.');
            }

            const contas = await db.ContaBancaria.findAll({
                where: { id_usuario: req.user.id }
            });

            res.render('despesas/despesasUpdate', {
                despesa: despesa.toJSON(),
                contas: contas.map(c => c.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar formulário de edição');
        }
    },

    async postUpdate(req, res) {
        try {
            const [updatedRows] = await db.Despesas.update(req.body, {
                where: {
                    id: req.body.id,
                    id_usuario: req.user.id
                }
            });
            if (updatedRows === 0) {
                return res.status(404).send('Despesa não encontrada ou você não tem permissão para atualizar.');
            }
            res.redirect('/despesas/list');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao atualizar despesa via formulário');
        }
    },

    async getDelete(req, res) {
        try {
            const deletedRows = await db.Despesas.destroy({
                where: {
                    id: req.params.id,
                    id_usuario: req.user.id
                }
            });
            if (deletedRows === 0) {
                return res.status(404).send('Despesa não encontrada ou você não tem permissão para deletar.');
            }
            res.redirect('/despesas/list');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar despesa via formulário');
        }
    },

    // --- Funções para a API REST - Entrega 4) ---

    async getExpenses(req, res) {
        try {
            const despesas = await db.Despesas.findAll({
                where: { id_usuario: req.user.id },
                include: [
                    { model: db.ContaBancaria, as: 'conta_bancaria' }
                ]
            });
            res.status(200).json(despesas.map(d => d.toJSON()));
        } catch (err) {
            console.error('Erro ao listar despesas:', err);
            res.status(500).json({ message: 'Erro interno do servidor ao listar despesas.' });
        }
    },

    async getExpenseById(req, res) {
        try {
            const despesa = await db.Despesas.findOne({
                where: {
                    id: req.params.id,
                    id_usuario: req.user.id
                },
                include: [
                    { model: db.ContaBancaria, as: 'conta_bancaria' }
                ]
            });
            if (!despesa) {
                return res.status(404).json({ message: 'Despesa não encontrada.' });
            }
            res.status(200).json(despesa.toJSON());
        } catch (err) {
            console.error('Erro ao buscar despesa por ID:', err);
            res.status(500).json({ message: 'Erro interno do servidor ao buscar despesa.' });
        }
    },

    async createExpense(req, res) {
        try {
            const newDespesa = await db.Despesas.create({
                id_usuario: req.user.id,
                id_conta: req.body.id_conta,
                descricao: req.body.descricao,
                valor: req.body.valor,
                date: req.body.date
            });
            res.status(201).json(newDespesa.toJSON());
        } catch (err) {
            console.error('Erro ao criar despesa:', err);
            res.status(500).json({ message: 'Erro interno do servidor ao criar despesa.' });
        }
    },

    async updateExpense(req, res) {
        try {
            const [updatedRows] = await db.Despesas.update(req.body, {
                where: {
                    id: req.params.id,
                    id_usuario: req.user.id
                }
            });
            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Despesa não encontrada ou você não tem permissão para atualizá-la.' });
            }
            const updatedDespesa = await db.Despesas.findByPk(req.params.id);
            res.status(200).json(updatedDespesa.toJSON());
        } catch (err) {
            console.error('Erro ao atualizar despesa:', err);
            res.status(500).json({ message: 'Erro interno do servidor ao atualizar despesa.' });
        }
    },

    async deleteExpense(req, res) {
        try {
            const deletedRows = await db.Despesas.destroy({
                where: {
                    id: req.params.id,
                    id_usuario: req.user.id
                }
            });
            if (deletedRows === 0) {
                return res.status(404).json({ message: 'Despesa não encontrada ou você não tem permissão para deletá-la.' });
            }
            res.status(204).send();
        } catch (err) {
            console.error('Erro ao deletar despesa:', err);
            res.status(500).json({ message: 'Erro interno do servidor ao deletar despesa.' });
        }
    }
};