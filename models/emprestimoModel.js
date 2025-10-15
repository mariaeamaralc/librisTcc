// models/emprestimoModel.js
const db = require('../config/database');

const Emprestimo = {
  // Lista empréstimos pendentes com paginação
  getAllPendentes: async () => {
        const query = `
            SELECT e.id, e.n_registro, e.status, u.nome AS usuario_nome, m.titulo
            FROM emprestimos e
            JOIN usuarios u ON e.usuario_id = u.id
            JOIN material m ON e.n_registro = m.n_registro
            WHERE e.status = 'pendente'
            ORDER BY e.id DESC
        `;
        const [rows] = await db.promise().query(query);
        return rows;
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
