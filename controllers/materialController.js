const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');
const db = require('../config/database');

const materialController = {

    renderRegistrarMaterial: async (req, res) => {
        try {
            const categorias = await Categoria.getAll();
            res.render('material/registrar', { 
                error: null,
                material: {}, 
                categoria: categorias,
                userRole: req.session.userRole
            });
        } catch (error) {
            console.error('Erro ao renderizar registro de material:', error);
            res.status(500).send('Erro ao carregar a página de registro.');
        }
    },

    registrarMaterial: async (req, res) => {
    const {
        n_registro, idioma, ISBN, autor,
        data_aquisicao, prateleira, titulo,
        n_paginas, tipo, editora, ano_publi, categoria
    } = req.body;

    if (!n_registro || !titulo) {
        return res.status(400).send('Número de registro e título são obrigatórios');
    }

    const newMaterial = {
        n_registro, idioma, ISBN, autor,
        data_aquisicao, prateleira, titulo,
        n_paginas, tipo, editora, ano_publi, categoria
    };

    try {
        await Material.registrar(newMaterial);
        res.redirect('/material/pesquisar?success=' + encodeURIComponent('Material registrado com sucesso!'));
    } catch (err) {
        const categorias = await Categoria.getAll(); 

        if (err.code === 'ER_DUP_ENTRY') {
            
            newMaterial.n_registro = ''; 
            newMaterial.ISBN = ''; 
            
            return res.render('material/registrar', {
                error: 'Número de registro e/ou ISBN já existem. Por favor, insira novos valores.',
                material: newMaterial,
                categoria: categorias,
                userRole: req.session.userRole
            });
        }
        
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' && err.sqlMessage.includes('chk_n_registro_8_digitos_exatos')) {
            
            return res.render('material/registrar', {
                error: 'O Número de Registro deve ser um número inteiro de 8 dígitos (entre 10.000.000 e 99.999.999).',
                material: newMaterial,
                categoria: categorias,
                userRole: req.session.userRole
            });
        }

        console.error('Erro ao registrar material:', err);
        return res.render('material/registrar', {
            error: 'Erro desconhecido ao registrar material.',
            material: newMaterial,
            categoria: categorias,
            userRole: req.session.userRole
        });
    }
},
    listarMateriais: async (req, res) => {
        try {
            const categoriaSelecionada = req.query.categoria || null;
            const categorias = await Categoria.getAll();
            const filtros = {};
            
            if (categoriaSelecionada) {
                filtros.categoria = categoriaSelecionada;
            }
            
            const materiais = await Material.buscarPorFiltros(filtros); 
            
            res.render('material/index', {
                materiais,
                categoria: categorias,
                categoriaSelecionada,
                paginaAtual: 1, 
                totalPaginas: 1, 
                success: req.query.success || null, 
                userRole: req.session.userRole,
                pendente: req.query.pendente,
                erro: req.query.erro || null, 
                query: ''
            });

        } catch (err) {
            console.error('Erro ao listar materiais:', err);
            res.status(500).send('Erro ao carregar materiais');
        }
    },

    renderPesquisarAcervo: async (req, res) => {
        try {
            const termo = req.query.query ? req.query.query.trim() : ''; 
            const categorias = await Categoria.getAll();
            
            let materiais;

            if (termo) {
                materiais = await Material.buscarPorTermo(termo);
            } else {
                materiais = await Material.buscarTodos(); 
            }

            res.render('material/index', {
                materiais,
                categoria: categorias,
                categoriaSelecionada: null, 
                paginaAtual: 1,
                totalPaginas: 1,
                success: req.query.success || null,
                userRole: req.session.userRole,
                pendente: req.query.pendente,
                erro: req.query.erro || null,
                query: termo
            });

        } catch (err) {
            console.error('Erro ao pesquisar acervo:', err);
            res.status(500).send('Erro interno ao pesquisar acervo');
        }
    },

    verMaterial: async (req, res) => {
        const { n_registro } = req.params;
        try {
            const material = await Material.findById(n_registro);
            if (!material) return res.status(404).send('Material não encontrado');

            const [emprestimos] = await db.promise().query(
                'SELECT status FROM emprestimos WHERE n_registro = ? AND (status = "pendente" OR status = "autorizado")',
                [n_registro]
            );

            material.situacao = emprestimos.length > 0 ? 'indisponivel' : 'disponivel';
            res.render('material/ver', { material, userRole: req.session.userRole });

        } catch (err) {
            console.error('Erro ao carregar material:', err);
            res.status(500).send('Erro interno');
        }
    },

    renderEditForm: async (req, res) => {
        const { n_registro } = req.params;
        try {
            const material = await Material.findById(n_registro);
            const categorias = await Categoria.getAll();

            if (!material) return res.status(404).send('Material não encontrado');

            res.render('material/edit', {
                material,
                categoria: categorias,
                error: null,
                userRole: req.session.userRole
            });
        } catch (err) {
            console.error('Erro ao carregar formulário de edição:', err);
            res.status(500).send('Erro interno');
        }
    },

   updateMaterial: async (req, res) => {
    const { n_registro } = req.params;
    const updatedMaterial = req.body;

    if (!updatedMaterial.ISBN || updatedMaterial.ISBN.trim() === '' || updatedMaterial.ISBN.length !== 13) {
        const categorias = await Categoria.getAll();
        const materialOriginal = await Material.findById(n_registro); 
        let errorMessage = 'O campo ISBN é obrigatório.';
        if (updatedMaterial.ISBN && updatedMaterial.ISBN.trim() !== '' && updatedMaterial.ISBN.length !== 13) {
            errorMessage = 'O ISBN deve conter exatamente 13 dígitos.';
        }

        return res.render('material/edit', {
            material: { ...materialOriginal, ...updatedMaterial }, 
            categoria: categorias,
            error: errorMessage,
            userRole: req.session.userRole
        });
    }
    
    updatedMaterial.ISBN = updatedMaterial.ISBN.trim(); 

    try {
        const resultado = await Material.update(n_registro, updatedMaterial);
        
        if (!resultado) return res.status(404).send('Material não encontrado');
        res.redirect('/material/pesquisar?success=' + encodeURIComponent('Material atualizado com sucesso!'));
        
    } catch (err) {
        
        if (err.code === 'ER_DUP_ENTRY') {
            const categorias = await Categoria.getAll();
            const materialOriginal = await Material.findById(n_registro); 
            
            return res.render('material/edit', {
                material: { ...materialOriginal, ...updatedMaterial }, 
                categoria: categorias,
                error: 'O ISBN já está sendo utilizados por outro material. Por favor, corrija para continuar.',
                userRole: req.session.userRole
            });
        }
        
        console.error('Erro ao atualizar material:', err);
        res.status(500).send('Erro interno ao atualizar material');
    }
},
    
    excluirMaterial: async (req, res) => {
        const { n_registro } = req.params;

        try {
            const [bloqueio] = await db.promise().query(
                "SELECT COUNT(id) AS count FROM emprestimos WHERE n_registro = ? AND (status = 'pendente' OR status = 'autorizado')",
                [n_registro]
            );

            if (bloqueio[0].count > 0) {
                const erroMsg = 'Material não pode ser excluído pois está em situação de empréstimo ou pendente.';
                return res.redirect('/material/pesquisar?erro=' + encodeURIComponent(erroMsg));
            }

            const resultado = await Material.delete(n_registro);

            if (resultado.affectedRows === 0) {
                return res.status(404).send('Material não encontrado');
            }

            const successMsg = 'Material excluído com sucesso!';
            res.redirect('/material/pesquisar?success=' + encodeURIComponent(successMsg));

        } catch (err) {
            console.error('Erro ao excluir material:', err);
            const erroMsg = 'Erro interno ao tentar excluir o material. Verifique as configurações do banco.';
            res.redirect('/material/pesquisar?erro=' + encodeURIComponent(erroMsg));
        }
    }
};

module.exports = materialController;