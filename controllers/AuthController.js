const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db_sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'gosto_de_java_porque_ele_paga_boleto';

module.exports = {
    async login(req, res) {
        const { login, senha } = req.body;

        try {
            const user = await db.Usuario.findOne({ where: { login } });

            if (!user) {
                return res.status(401).json({ message: 'Login ou senha inválidos.' });
            }


            const isPasswordValid = await bcrypt.compare(senha, user.senha);

            if (!isPasswordValid) {

                 if (senha !== user.senha) {
                    return res.status(401).json({ message: 'Login ou senha inválidos.' });
                 }
            }

            const token = jwt.sign(
                { id: user.id, login: user.login, tipo: user.tipo },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    verifyToken(req, res, next) {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'Nenhum token fornecido.' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).json({ message: 'Token inválido ou expirado.' });
            }

            req.user = decoded;
            next();
        });
    }
};