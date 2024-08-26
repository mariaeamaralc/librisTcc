const Produto = require('../models/produtoModel'); //importar o model de produto
const Categoria = require('../models/categoriaModel'); //importar o model de categoria

const produtoController = {
    createProduto: (req, res) => {
        const newProduto = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria,
        };

        Produto.create(newProduto, (err, produtoId) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/produtos');
        });
    },

    getProdutoById: (req, res) => {
        const produtoId = req.params.id;

    // Consultar o produto pelo ID
    db.query('SELECT * FROM produtos WHERE id = ?', [produtoId], (err, produtoResult) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o produto.');
        }

        // Verificar se o produto existe
        if (produtoResult.length === 0) {
            return res.status(404).send('Produto não encontrado.');
        }

        const produto = produtoResult[0];
        
        // Consultar todas as categorias
        Categoria.getAll((err, categoriasResult) => {
            if (err) {
                return res.status(500).send('Erro ao buscar categorias.');
            }
        
            // Renderizar a view passando o produto e as categorias
            res.render('produtos/edit', {
                produto: produto,
                categorias: categoriasResult // Passa as categorias para a view
            });
        });
    });
    },

    getAllProdutos: (req, res) => {
        Produto.getAll((err, produtos) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.render('produtos/index', { produtos });
        });
    },

    renderCreateForm: (req, res) => {
        try {
            Categoria.getAll((err, categorias) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.render('produtos/create', { categorias });
            });
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).send('Erro ao carregar o formulário de criação de produto.');
        }
    },

    renderEditForm: (req, res) => {
        const produtoId = req.params.id;

        // Consulta o produto e as categorias
        db.query('SELECT * FROM produtos WHERE id = ?', [produtoId], (err, produtoResult) => {
            if (err) {
                return res.status(500).send('Erro ao buscar produto');
            }

        db.query('SELECT * FROM categorias', (err, categoriasResult) => {
            if (err) {
                return res.status(500).send('Erro ao buscar categorias');
            }

            // Renderiza a view passando o produto e as categorias
            res.render('produtos/edit', {
                produto: produtoResult[0], 
                categorias: categoriasResult
            });
        });
    });
    },

    updateProduto: (req, res) => {
        const produtoId = req.params.id;
        const updatedProduto = {
            nome: req.body.nome,
            preco: req.body.preco,
            descricao: req.body.descricao,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria,
        };

        Produto.update(produtoId, updatedProduto, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/produtos');
        });
    },

    deleteProduto: (req, res) => {
        const produtoId = req.params.id;

        Produto.delete(produtoId, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/produtos');
        });
    }
};

module.exports = produtoController;
