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
exports.listarPendentes = (req, res) => {
  db.query('SELECT * FROM emprestimos WHERE status = "pendente"', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar empréstimos');
    res.render('emprestimos/pendentes', { emprestimos: results, userRole: req.session.userRole });
  });
};

// Admin autoriza empréstimo e define data de devolução
exports.autorizarEmprestimo = (req, res) => {
  const { id } = req.params;
  const { data_devolucao } = req.body;
  const sql = 'UPDATE emprestimos SET status = "autorizado", data_devolucao = ? WHERE id = ?';
  db.query(sql, [data_devolucao, id], (err) => {
    if (err) return res.status(500).send('Erro ao autorizar empréstimo');
    res.redirect('/emprestimos/pendentes');
  });
};