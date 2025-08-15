const db = require('../config/database');

const Material = {
  // 🔹 Registrar novo material
  registrar: async (material) => {
    const query = `
      INSERT INTO material (
        n_registro, idioma, ISBN, autor, data_aquisicao, prateleira, titulo,
        n_paginas, tipo, editora, ano_publi, categoria
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      material.n_registro,
      material.idioma,
      material.ISBN,
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

  // 🔹 Buscar material por número de registro (com nome da categoria)
  findById: async (n_registro) => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      WHERE m.n_registro = ?
    `;
    const [results] = await db.promise().query(query, [n_registro]);
    return results[0] || null;
  },

  // 🔹 Atualizar material
  update: async (n_registro, material) => {
    const campos = [
      'idioma = ?', 'ISBN = ?', 'autor = ?', 'data_aquisicao = ?',
      'prateleira = ?', 'titulo = ?', 'n_paginas = ?', 'tipo = ?',
      'editora = ?', 'ano_publi = ?', 'categoria = ?'
    ];

    const values = [
      material.idioma,
      material.ISBN,
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

    const query = `
      UPDATE material SET
      ${campos.join(', ')}
      WHERE n_registro = ?
    `;
    const [result] = await db.promise().query(query, values);
    return result;
  },

  // 🔹 Excluir material
  delete: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  },

  // 🔹 Buscar todos os materiais com nome da categoria
  buscarTodos: async () => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
    `;
    const [results] = await db.promise().query(query);
    return results;
  },

  // 🔹 Buscar materiais por categoria
  buscarPorCategoria: async (categoriaId) => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      WHERE m.categoria = ?
    `;
    const [results] = await db.promise().query(query, [categoriaId]);
    return results;
  },

  // 🔹 Excluir por número de registro (duplicado)
  excluirPorRegistro: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  }
};

module.exports = Material;