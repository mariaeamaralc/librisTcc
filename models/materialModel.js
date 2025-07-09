const db = require('../config/database');

const Material = {
    create: (material, callback) => {
        const query = 'INSERT INTO material (nome, descricao, preco, quantidade, categoria) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [material.nome, material.descricao, material.preco, material.quantidade, material.categoria], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.insertId);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT material.*, categorias.nome AS categoria_nome FROM material JOIN categorias ON material.categoria = categorias.id WHERE material.id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },

    update: (id, material, callback) => {
        const query = 'UPDATE material SET nome = ?, preco = ?, descricao = ?, quantidade = ?, categoria = ? WHERE id = ?';
        db.query(query, [material.nome, material.preco, material.descricao, material.quantidade, material.categoria, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM material WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },

    getAll: (categoria, callback) => {
        let query = 'SELECT material.id, material.nome, material.descricao, material.preco, material.quantidade, categorias.nome AS categoria_nome FROM material JOIN categorias ON material.categoria = categorias.id';
        
        if (categoria) {
            query += ' WHERE material.categoria = ?';
        }
    
        db.query(query, [categoria], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    
};

module.exports = Material;