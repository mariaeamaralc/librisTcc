const db = require('../config/database'); 

const Categoria = {
    getAll: async () => {
        const query = 'SELECT id, nome FROM categoria ORDER BY nome';
        try {
            const [rows] = await db.promise().query(query); 
            return rows;
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
    },
    
    create: async (nome) => {
        const query = 'INSERT INTO categoria (nome) VALUES (?)';
        try {
            const [result] = await db.promise().query(query, [nome]);
            return result;
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    },

    findById: async (id) => {
        const query = 'SELECT id, nome FROM categoria WHERE id = ?';
        try {
            const [rows] = await db.promise().query(query, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar categoria por ID:', error);
            throw error;
        }
    },
    
    update: async (id, nome) => {
        const query = 'UPDATE categoria SET nome = ? WHERE id = ?';
        try {
            const [result] = await db.promise().query(query, [nome, id]);
            return result;
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            throw error;
        }
    },

    delete: async (id) => {
        const query = 'DELETE FROM categoria WHERE id = ?';
        try {
            const [result] = await db.promise().query(query, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
            throw error;
        }
    }
};

module.exports = Categoria;