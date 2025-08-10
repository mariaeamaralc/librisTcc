const db = require('../config/database');

const Categoria = {
  findById: async (id) => {
    const query = 'SELECT * FROM categoria WHERE id = ?';
    const [results] = await db.promise().query(query, [id]);
    return results[0];
  },

  findByCategorianame: async (nome) => {
    const query = 'SELECT * FROM categoria WHERE nome = ?';
    const [results] = await db.promise().query(query, [nome]);
    return results[0];
  },

  update: async (id, categoria) => {
    const query = 'UPDATE categoria SET nome = ? WHERE id = ?';
    const [result] = await db.promise().query(query, [categoria.nome, id]);
    return result;
  },

  delete: async (id) => {
    const query = 'DELETE FROM categoria WHERE id = ?';
    const [result] = await db.promise().query(query, [id]);
    return result;
  },

  getAll: async () => {
    const query = 'SELECT * FROM categoria';
    const [results] = await db.promise().query(query);
    return results;
  }
};

module.exports = Categoria;