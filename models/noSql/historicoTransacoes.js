const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetalhesSchema = new Schema({
    descricao: { type: String, required: true },
    valor: { type: Number, required: true },
    data: { type: Date, required: true },
    conta_bancaria: { type: String, required: true }
}, { _id: false });

const HistoricoTransacoesSchema = new Schema({
    id_usuario: { type: String, required: true },
    tipo_transacao: { type: String, required: true, enum: ['despesa', 'receita'] },
    acao: { type: String, required: true, enum: ['criado', 'editado', 'excluido'] },
    detalhes: { type: DetalhesSchema, required: true },
});

module.exports = mongoose.model("HistoricoTransacoes", HistoricoTransacoesSchema);
