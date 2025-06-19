const db = require('../db');

exports.listarPedidos = (req, res) => {
  const sql = `
    SELECT pedidos.*, users.username, produtos.nome AS produto_nome
    FROM pedidos
    JOIN users ON pedidos.user_id = users.id
    JOIN produtos ON pedidos.produto_id = produtos.id
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('pedidos/lista', { pedidos: results });
  });
};

exports.formularioPedido = (req, res) => {
  const sqlUsers = 'SELECT * FROM users';
  const sqlProdutos = 'SELECT * FROM produtos';

  db.query(sqlUsers, (err, users) => {
    if (err) throw err;
    db.query(sqlProdutos, (err2, produtos) => {
      if (err2) throw err2;
      res.render('pedidos/form', { users, produtos });
    });
  });
};

exports.criarPedido = (req, res) => {
  const { user_id, produto_id, quantidade } = req.body;
  const sql = 'INSERT INTO pedidos (user_id, produto_id, quantidade) VALUES (?, ?, ?)';
  db.query(sql, [user_id, produto_id, quantidade], (err) => {
    if (err) throw err;
    res.redirect('/pedidos');
  });
};
