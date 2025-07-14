const db = require('../config/database');

const Material = {
    create: (material, callback) => {
        const query = `
            INSERT INTO material (
                n_registro, idioma, isbn, autor, data_aquisicao, prateleira, titulo,
                n_paginas, tipo, editora, ano_publi, preco, quantidade, categoria
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            material.ano_publi,
            material.preco,
            material.quantidade,
            material.categoria
        ];
        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (n_registro, callback) => {
        const query = `
            SELECT m.*, c.nome AS categoria_nome
            FROM material m
            JOIN categorias c ON m.categoria = c.id
            WHERE m.n_registro = ?
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
                n_paginas = ?, tipo = ?, editora = ?, ano_publi = ?, preco = ?, quantidade = ?, categoria = ?
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
            material.preco,
            material.quantidade,
            material.categoria,
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

    getAll: (categoria, callback) => {
        let query = `
            SELECT m.n_registro, m.titulo, m.autor, m.idioma, m.ano_publi, m.prateleira, m.tipo, 
                   m.quantidade, c.nome AS categoria_nome
            FROM material m
            JOIN categorias c ON m.categoria = c.id
        `;
        const values = [];

        if (categoria) {
            query += ' WHERE m.categoria = ?';
            values.push(categoria);
        }

        db.query(query, values, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Material;
