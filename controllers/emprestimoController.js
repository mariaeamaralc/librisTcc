const db = require('../config/database');

// Usuário solicita empréstimo
exports.solicitarEmprestimo = (req, res) => {
  const { n_registro } = req.body;
  const usuario_id = req.session.userId; // ou req.session.usuarioId
  const sql = 'INSERT INTO emprestimos (usuario_id, n_registro, status) VALUES (?, ?, "pendente")';
  db.query(sql, [usuario_id, n_registro], (err) => {
    console.error('Erro MySQL:', err);
    if (err) return res.status(500).send('Erro ao solicitar empréstimo');
    res.redirect('/material/pesquisar');
  });
};

// Admin vê solicitações pendentes
exports.listarPendentes = async (req, res) => {
  try {
    const [emprestimos] = await db.promise().query(
      `SELECT e.id, e.n_registro, e.usuario_id, e.status, u.nome AS usuario_nome, m.titulo
       FROM emprestimos e
       JOIN usuarios u ON e.usuario_id = u.id
       JOIN material m ON e.n_registro = m.n_registro
       WHERE e.status = 'pendente'`
    );
    res.render('emprestimos/pendentes', { emprestimos, userRole: req.session.userRole });
  } catch (err) {
    console.error('Erro ao buscar empréstimos pendentes:', err);
    res.status(500).send('Erro ao buscar empréstimos pendentes');
  }
};
// Admin autoriza empréstimo e define data de devolução
exports.autorizarEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    // Define data de devolução para 15 dias a partir de hoje
    const hoje = new Date();
    const data_devolucao = new Date(hoje.setDate(hoje.getDate() + 15));
    const dataFormatada = data_devolucao.toISOString().split('T')[0];

    await db.promise().query(
      'UPDATE emprestimos SET status = "autorizado", data_devolucao = ? WHERE id = ?',
      [dataFormatada, id]
    );
    res.redirect('/emprestimos/pendentes');
  } catch (err) {
    console.error('Erro ao autorizar empréstimo:', err);
    res.status(500).send('Erro ao autorizar empréstimo');
  }
};

exports.recusarEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query(
      'UPDATE emprestimos SET status = "recusado" WHERE id = ?',
      [id]
    );
    res.redirect('/emprestimos/pendentes');
  } catch (err) {
    console.error('Erro ao recusar empréstimo:', err);
    res.status(500).send('Erro ao recusar empréstimo');
  }
};