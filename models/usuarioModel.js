const db = require('../config/database');

const Usuario = {
    create: (usuario, callback) => {
        const query = 'INSERT INTO usuarios (matricula, nome, email, idade, senha, role) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [usuario.matricula, usuario.nome, usuario.email, usuario.idade, usuario.senha, usuario.role], (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT * FROM usuarios WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    findByMatricula: (matricula, callback) => {
        const query = 'SELECT * FROM usuarios WHERE matricula = ?';
        db.query(query, [matricula], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    update: (id, usuario, callback) => {
        const query = 'UPDATE usuarios SET matricula = ?, nome = ?, email = ?, idade = ?, senha = ?, role = ? WHERE id = ?';
        db.query(query, [usuario.matricula, usuario.nome, usuario.email, usuario.idade, usuario.senha, usuario.role, id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM usuarios WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM usuarios';
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    searchByName: (name, callback) => {
        const query = 'SELECT * FROM usuarios WHERE nome LIKE ?';
        db.query(query, [`%${name}%`], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = usuarioController;