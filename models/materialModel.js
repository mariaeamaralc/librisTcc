const db = require('../config/database');

const Material = {
  // Busca todos os materiais com paginação
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

  // Conta todos os materiais
  contarTodos: async () => {
    const query = 'SELECT COUNT(*) AS total FROM material';
    const [results] = await db.promise().query(query);
    return parseInt(results[0].total, 10);
  },

  // Busca materiais por termo (n_registro, título ou autor) com paginação
  buscarPorTermoPaginado: async (termo, limite, offset) => {
    const likeTerm = `%${termo}%`;
    const query = `
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      WHERE m.n_registro LIKE ? OR m.titulo LIKE ? OR m.autor LIKE ?
      ORDER BY m.titulo
      LIMIT ? OFFSET ?
    `;
    const [results] = await db.promise().query(query, [likeTerm, likeTerm, likeTerm, limite, offset]);
    return results;
  },

  // Conta materiais por termo
  contarPorTermo: async (termo) => {
    const likeTerm = `%${termo}%`;
    const query = `
      SELECT COUNT(*) AS total
      FROM material
      WHERE n_registro LIKE ? OR titulo LIKE ? OR autor LIKE ?
    `;
    const [results] = await db.promise().query(query, [likeTerm, likeTerm, likeTerm]);
    return parseInt(results[0].total, 10);
  },

  // Busca materiais paginados, opcionalmente filtrando por categoria
  getMateriaisPaginados: async (pagina, limite, categoriaId) => {
    const offset = (pagina - 1) * limite;
    let where = '';
    const params = [];

    if (categoriaId) {
      where = 'WHERE m.categoria = ?';
      params.push(categoriaId);
    }

    // Conta total de itens
    const [totalResult] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM material m ${where}`,
      params
    );
    const totalItens = totalResult[0].total;

    // Busca os materiais da página
    const [materiais] = await db.promise().query(`
      SELECT m.*, c.nome AS categoria_nome
      FROM material m
      LEFT JOIN categoria c ON m.categoria = c.id
      ${where}
      ORDER BY m.n_registro DESC
      LIMIT ? OFFSET ?
    `, [...params, limite, offset]);

    return { materiais, totalItens };
  },

  // Registrar novo material
  registrar: async (newMaterial) => {
    const query = `
      INSERT INTO material
      (n_registro, idioma, ISBN, autor, data_aquisicao, prateleira, titulo, n_paginas, tipo, editora, ano_publi, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      newMaterial.n_registro,
      newMaterial.idioma,
      newMaterial.ISBN,
      newMaterial.autor,
      newMaterial.data_aquisicao,
      newMaterial.prateleira,
      newMaterial.titulo,
      newMaterial.n_paginas,
      newMaterial.tipo,
      newMaterial.editora,
      newMaterial.ano_publi,
      newMaterial.categoria
    ];
    await db.promise().query(query, values);
  },

  // Encontrar material pelo número de registro
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
    return result.affectedRows > 0 ? result : null;
  },

  // Excluir material
  delete: async (n_registro) => {
    const query = 'DELETE FROM material WHERE n_registro = ?';
    const [result] = await db.promise().query(query, [n_registro]);
    return result;
  }
};

module.exports = Material;
