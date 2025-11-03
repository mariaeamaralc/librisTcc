const Categoria = require('../models/categoriaModel');
const categoriaController = {
    
    getAllCategorias: async (req, res) => {
        try {
            const categorias = await Categoria.getAll();
            res.render('categoria/index', { categorias, error: null, userRole: req.session.userRole });
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            res.status(500).send('Erro interno ao listar categorias.');
        }
    },
    
    renderCreateForm: (req, res) => {
        res.render('categoria/create', { error: null, nome: '', userRole: req.session.userRole });
    },
    
    createCategoria: async (req, res) => {
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
            return res.render('categoria/create', { error: 'O nome da categoria é obrigatório.', nome, userRole: req.session.userRole });
        }
        try {
            await Categoria.create(nome);
            res.redirect('/categorias?success=' + encodeURIComponent('Categoria criada com sucesso.'));
        } catch (error) {
            let errorMessage = 'Erro ao criar categoria.';
            if (error.code === 'ER_DUP_ENTRY') {
                 errorMessage = 'Esta categoria já existe.';
            }
            console.error('Erro ao criar categoria:', error);
            res.render('categoria/create', { error: errorMessage, nome, userRole: req.session.userRole });
        }
    },

    getCategoriaById: async (req, res) => {
        const { id } = req.params;
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                return res.status(404).send('Categoria não encontrada.');
            }
            res.render('categoria/view', { categoria, userRole: req.session.userRole });
        } catch (error) {
            console.error('Erro ao buscar categoria por ID:', error);
            res.status(500).send('Erro interno.');
        }
    },
    
    renderEditForm: async (req, res) => {
        const { id } = req.params;
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                return res.status(404).send('Categoria não encontrada.');
            }
            res.render('categoria/edit', { categoria, error: null, userRole: req.session.userRole });
        } catch (error) {
            console.error('Erro ao carregar formulário de edição:', error);
            res.status(500).send('Erro interno.');
        }
    },
    
    updateCategoria: async (req, res) => {
        const { id } = req.params;
        const { nome } = req.body;
        
        if (!nome || nome.trim() === '') {
            const categoriaAtual = await Categoria.findById(id);
            return res.render('categoria/edit', { categoria: categoriaAtual, error: 'O nome da categoria é obrigatório.', userRole: req.session.userRole });
        }
        
        try {
            await Categoria.update(id, nome);
            res.redirect('/categorias?success=' + encodeURIComponent('Categoria atualizada com sucesso.'));
        } catch (error) {
            let errorMessage = 'Erro ao atualizar categoria.';
            if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = 'Esta categoria já existe.';
            }
            console.error('Erro ao atualizar categoria:', error);
            const categoriaAtual = await Categoria.findById(id);
            res.render('categoria/edit', { categoria: categoriaAtual, error: errorMessage, userRole: req.session.userRole });
        }
    },

    deleteCategoria: async (req, res) => {
        const { id } = req.params;
        try {
            await Categoria.delete(id);
            res.redirect('/categorias?success=' + encodeURIComponent('Categoria excluída com sucesso.'));
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
            res.redirect('/categorias?error=' + encodeURIComponent('Não foi possível excluir a categoria. Pode haver materiais vinculados.'));
        }
    }
};

module.exports = categoriaController;