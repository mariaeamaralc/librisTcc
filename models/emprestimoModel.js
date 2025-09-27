// models/emprestimoModel.js
const db = require('../config/database');

const Emprestimo = {
  // Lista empréstimos pendentes com paginação
  getPendentesPaginados: async (pagina = 1, limite = 10) => {
    const offset = (pagina - 1) * limite;

    // Conta total de pendentes
    const [totalResult] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM emprestimos WHERE status = 'pendente'"
    );
    const totalItens = totalResult[0].total;
    const totalPaginas = Math.ceil(totalItens / limite);

    // Busca os pendentes
    const [emprestimos] = await db.promise().query(`
      SELECT e.id, e.n_registro, e.status, u.nome AS usuario_nome, m.titulo
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN material m ON e.n_registro = m.n_registro
      WHERE e.status = 'pendente'
      ORDER BY e.id DESC
      LIMIT ? OFFSET ?
    `, [limite, offset]);

    return { emprestimos, totalItens, totalPaginas };
  },

  autorizar: async (id, dataDevolucao) => {
    return db.promise().query(
      'UPDATE emprestimos SET status = ?, data_devolucao = ? WHERE id = ?',
      ['autorizado', dataDevolucao, id]
    );
  },

  recusar: async (id) => {
    return db.promise().query(
      'UPDATE emprestimos SET status = ? WHERE id = ?',
      ['recusado', id]
    );
  }
};

module.exports = Emprestimo;
