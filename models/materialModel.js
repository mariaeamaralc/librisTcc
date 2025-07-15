const db = require('../config/database');

const Material = {
    registrar: (material, callback) => {
        const query = `
            INSERT INTO material (
                n_registro, idioma, isbn, autor, data_aquisicao, prateleira, titulo,
                n_paginas, tipo, editora, ano_publi
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            material.n_registro,
            material.idioma,
            material.isbn,
            material.autor,
            material.data_aquisicao,
            material.prateleira,
            material.titulo,
            material.n_paginas,
            material.tipo,
            material.editora,
            material.ano_publi
        ];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (n_registro, callback) => {
        const query = `
            SELECT * FROM material WHERE n_registro = ?
        `;
        db.query(query, [n_registro], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    update: (n_registro, material, callback) => {
        const query = `
            UPDATE material SET
                idioma = ?, isbn = ?, autor = ?, data_aquisicao = ?, prateleira = ?, titulo = ?,
                n_paginas = ?, tipo = ?, editora = ?, ano_publi = ?
            WHERE n_registro = ?
        `;
        const values = [
            material.idioma,
            material.isbn,
            material.autor,
            material.data_aquisicao,
            material.prateleira,
            material.titulo,
            material.n_paginas,
            material.tipo,
            material.editora,
            material.ano_publi,
            n_registro
        ];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    delete: (n_registro, callback) => {
        const query = 'DELETE FROM material WHERE n_registro = ?';
        db.query(query, [n_registro], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getAll: (callback) => {
        const query = `
            SELECT * FROM material
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Material;
