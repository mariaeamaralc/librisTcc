const db = require('../config/database');
const Emprestimo = require('../models/emprestimoModel'); 
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
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;

    // Buscar empréstimos pendentes do banco (usa o objeto retornado pelo model)
    const { emprestimos, totalItens, totalPaginas } = await Emprestimo.getPendentesPaginados(pagina, limite);

    res.render('emprestimos/pendentes', {
      emprestimos,
      paginaAtual: pagina,
      totalPaginas,
      totalItens,
      success: req.query.success || undefined,
      erro: req.query.erro || undefined
    });
  } catch (err) {
    console.error(err);
    res.send('Erro ao listar empréstimos pendentes');
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

// Dashboard admin com todos os empréstimos
exports.dashboardAdmin = async (req, res) => {
  try {
    // Buscar empréstimos pendentes
    const [pendentes] = await db.promise().query(`
      SELECT e.id, e.n_registro, e.status, u.nome AS usuario_nome, m.titulo
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN material m ON e.n_registro = m.n_registro
      WHERE e.status = 'pendente'
      ORDER BY e.id DESC
    `);

    // Buscar empréstimos autorizados (para receber devolução)
    const [ativos] = await db.promise().query(`
      SELECT e.id, e.n_registro, e.status, u.nome AS usuario_nome, m.titulo
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN material m ON e.n_registro = m.n_registro
      WHERE e.status = 'autorizado'
      ORDER BY e.id DESC
    `);

    res.render('emprestimos/dashboard', { 
      pendentes,
      ativos,
      success: req.query.success || null,
      erro: req.query.erro || null
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro ao carregar dashboard');
  }
};


exports.receberDevolucao = async (req, res) => {
  const { id } = req.params;

  try {
    // Atualiza o status do empréstimo para 'devolvido'
    await db.promise().query(
      'UPDATE emprestimos SET status = "devolvido" WHERE id = ?',
      [id]
    );

    // Marca o livro como disponível novamente
    // Caso tenha um campo 'disponivel' na tabela material
    await db.promise().query(
      'UPDATE material SET disponivel = 1 WHERE n_registro = (SELECT n_registro FROM emprestimos WHERE id = ?)',
      [id]
    );

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao receber devolução:', err);
    res.status(500).send('Erro ao processar devolução');
  }
};
