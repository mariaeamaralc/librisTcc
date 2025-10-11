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

  // Buscar todos os materiais paginados
  buscarTodosPaginado: async (limite, offset) => {
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      ORDER BY m.titulo
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.promise().query(query, [limite, offset]);
    return rows;
  },

  // Busca todos os materiais com termo e paginação
buscarPorTermoPaginado: async (termo, page, limit) => {
    const offset = (page - 1) * limit;
    const termoBuscaParcial = `%${termo}%`; // Para Título, Autor, ISBN

    // 1. QUERY DE BUSCA
    const [rows] = await db.promise().query(
      `SELECT m.*, c.nome AS categoria_nome
       FROM material m
       LEFT JOIN categoria c ON m.categoria = c.id
       WHERE m.titulo LIKE ? OR m.autor LIKE ? OR m.ISBN LIKE ? OR m.n_registro = ?
       LIMIT ? OFFSET ?`,
      [termoBuscaParcial, termoBuscaParcial, termoBuscaParcial, termo, limit, offset]
      // Note que o termo (variável original) é usado para n_registro (pesquisa exata)
    );

    // 2. QUERY DE CONTAGEM
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total
       FROM material
       WHERE titulo LIKE ? OR autor LIKE ? OR ISBN LIKE ? OR n_registro = ?`,
      [termoBuscaParcial, termoBuscaParcial, termoBuscaParcial, termo]
    );

    return { rows, total: countResult[0].total };
},

  // Contar todos os materiais
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
      WHERE n_registro = ?
    `;
    const values = [
      updatedMaterial.titulo,
      updatedMaterial.autor,
      updatedMaterial.editora,
      updatedMaterial.ano_publi,
      updatedMaterial.ISBN,
      updatedMaterial.idioma,
      updatedMaterial.n_paginas,
      updatedMaterial.tipo,
      updatedMaterial.prateleira,
      updatedMaterial.data_aquisicao,
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
