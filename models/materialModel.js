const db = require('../config/database');

const Material = {
  registrar: async (material) => {
    const query = `
      INSERT INTO material (
        n_registro, idioma, isbn, autor, data_aquisicao, prateleira, titulo,
        n_paginas, tipo, editora, ano_publi, categoria
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      material.categoria
    ];
    const [result] = await db.promise().query(query, values);
    return result.insertId;
  },

  findById: async (n_registro) => {
    const query = `SELECT * FROM material WHERE n_registro = ?`;
    const [results] = await db.promise().query(query, [n_registro]);
    return results[0];
  },

  update: async (n_registro, material) => {
    const query = `
      UPDATE material SET
        idioma = ?, isbn = ?, autor = ?, data_aquisicao = ?, prateleira = ?, titulo = ?,
        n_paginas = ?, tipo = ?, editora = ?, ano_publi = ?, categoria = ?
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
      material.categoria,
      n_registro
    ];
    const [result] = await db.promise().query(query, values);
    return result;
  },

  delete: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  },

  getAll: async () => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
    `;
    const [results] = await db.promise().query(query);
    return results;
  },

  excluirPorRegistro: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  }
};

module.exports = Material;