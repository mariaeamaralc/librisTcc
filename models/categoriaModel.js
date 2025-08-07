const db = require('../config/database');

const Categoria = {
  findById: (id, callback) => {
    const query = 'SELECT * FROM categoria WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  },

  findByCategorianame: (nome, callback) => {
    const query = 'SELECT * FROM categoria WHERE nome = ?';
    db.query(query, [nome], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  },

  update: (id, categoria, callback) => {
    const query = 'UPDATE categoria SET nome = ? WHERE id = ?';
    db.query(query, [categoria.nome, id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM categoria WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM categoria';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = Categoria;
