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
    const [results] = await db.promise().query(query, [limite, offset]);
    return results;
  },

  // Contar todos os materiais
  contarTodos: async () => {
    const query = 'SELECT COUNT(*) AS total FROM material';
    const [results] = await db.promise().query(query);
    return parseInt(results[0].total, 10);
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
    return results[0];
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
