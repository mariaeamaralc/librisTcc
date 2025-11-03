const db = require('../config/database');
const Material = {
  registrar: async (novoMaterial) => {
    const query = `
      INSERT INTO material
      (n_registro, idioma, ISBN, autor, data_aquisicao, prateleira, titulo, 
        n_paginas, tipo, editora, ano_publi, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      novoMaterial.n_registro,
      novoMaterial.idioma,
      novoMaterial.ISBN,
      novoMaterial.autor,
      novoMaterial.data_aquisicao,
      novoMaterial.prateleira,
      novoMaterial.titulo,
      novoMaterial.n_paginas,
      novoMaterial.tipo,
      novoMaterial.editora,
      novoMaterial.ano_publi,
      novoMaterial.categoria
    ];

    const [result] = await db.promise().query(query, values);
    return result;
  },

  buscarTodos: async () => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      ORDER BY m.titulo
    `;
    const [rows] = await db.promise().query(query);
    return rows;
  },

  buscarPorFiltros: async (filtros) => {
    let query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
    `;
    const values = [];

    // ⬇️ CORREÇÃO APLICADA AQUI ⬇️
    // A condição verifica se o filtro existe E se o valor não é 'todos' (ou equivalente)
    if (filtros && filtros.categoria && filtros.categoria !== 'todos') { 
      query += ` WHERE m.categoria = ?`; 
      values.push(filtros.categoria);
    }
    // ⬆️ CORREÇÃO APLICADA AQUI ⬆️
    
    query += ` ORDER BY m.titulo`;

    const [rows] = await db.promise().query(query, values);
    return rows;
  },

  buscarPorTermo: async (termo) => {
    const termoBuscaParcial = `%${termo}%`;
    const [rows] = await db.promise().query(
        `SELECT m.*, c.nome AS categoria_nome
         FROM material m
         LEFT JOIN categoria c ON m.categoria = c.id
         WHERE m.titulo LIKE ? OR m.autor LIKE ? OR m.ISBN LIKE ? OR m.n_registro = ?
         ORDER BY m.titulo`,
        [termoBuscaParcial, termoBuscaParcial, termoBuscaParcial, termo]
    );

    return rows;
  },

  contarTodos: async () => {
    const [results] = await db.promise().query('SELECT COUNT(*) AS total FROM material');
    return results[0].total;
  },

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

  update: async (n_registro, updatedMaterial) => {
    const query = `
     UPDATE material
       SET titulo = ?, autor = ?, editora = ?, ano_publi = ?, ISBN = ?, idioma = ?,
         n_paginas = ?, tipo = ?, prateleira = ?, data_aquisicao = ?, categoria = ?
          WHERE n_registro = ? `;

    const values = [
      updatedMaterial.titulo,
      updatedMaterial.autor,
      updatedMaterial.editora,
      updatedMaterial.ano_publi,
      updatedMaterial.ISBN || null,
      updatedMaterial.idioma,
      updatedMaterial.n_paginas || null,
      updatedMaterial.tipo,
      updatedMaterial.prateleira,
      updatedMaterial.data_aquisicao || null,
      updatedMaterial.categoria,
      n_registro
    ];
    const [result] = await db.promise().query(query, values);
    return result;
  },

  delete: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  }
};

module.exports = Material;