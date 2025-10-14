const db = require('../config/database');

const Material = {
  // Registrar material
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

  // NOVO: Busca TODOS os materiais (substitui buscarTodosPaginado)
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

  // Busca por filtros (já existente)
  buscarPorFiltros: async (filtros) => {
    let query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
    `;
    const values = [];

    if (filtros && filtros.categoria) {
      query += ` WHERE m.categoria = ?`; 
      values.push(filtros.categoria);
    }
    query += ` ORDER BY m.titulo`;

    const [rows] = await db.promise().query(query, values);
    return rows;
  },

  // NOVO: Busca por termo (substitui buscarPorTermoPaginado)
  buscarPorTermo: async (termo) => {
    const termoBuscaParcial = `%${termo}%`;

    // Removemos LIMIT, OFFSET e COUNT
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

  // Contar todos os materiais (ainda útil para dashboards, mas não para listagem)
  contarTodos: async () => {
    const [results] = await db.promise().query('SELECT COUNT(*) AS total FROM material');
    return results[0].total;
  },

  // Buscar material por ID
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

  // Atualizar material
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

  // Excluir material
  delete: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  }
};

module.exports = Material;