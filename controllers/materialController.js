const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');

const materialController = {
  renderRegistrarMaterial: async (req, res) => {
    try {
      const categoria = await Categoria.getAll();
      res.render('material/registrar', {
        error: null,
        material: {},
        categoria,
        userRole: req.session.userRole // Adicionado
      });
    } catch (err) {
      console.error('Erro ao buscar categoria:', err);
      res.status(500).send('Erro interno ao buscar categoria');
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
      res.redirect('/material/pesquisar?success=1');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        try {
          const categoria = await Categoria.getAll();
          return res.render('material/registrar', {
            error: 'Número de registro já existe.',
            material: newMaterial,
            categoria,
            userRole: req.session.userRole // Adicionado
          });
        } catch (catErr) {
          return res.status(500).send('Erro interno ao buscar categoria');
        }
      }
      console.error('Erro ao registrar material:', err);
      res.status(500).send('Erro ao registrar material');
    }
  },

  renderPesquisarAcervo: async (req, res) => {
    const { query, pendente} = req.query;
    try {
      let materiais = [];

      if (query) {
        materiais = await Material.buscarPorTermo(query);
      } else {
        materiais = await Material.buscarTodos();
      }

      const categoria = await Categoria.getAll();

      res.render('material/index', {
        materiais,
        categoria,
        categoriaSelecionada: null,
        success: req.query.success === '1',
        userRole: req.session.userRole, // Adicionado
        pendente,
         erro: req.query.erro
      });

    } catch (err) {
      console.error('Erro ao buscar acervo:', err);
      res.status(500).send('Erro interno ao buscar acervo');
    }
  },

  listarMateriais: async (req, res) => {
    try {
      const categoriaId = req.query.categoria;
      let materiais;

      if (categoriaId) {
        materiais = await Material.buscarPorCategoria(categoriaId);
      } else {
        materiais = await Material.buscarTodos();
      }

      const categorias = await Categoria.getAll();
      const solicitacao = req.query.solicitacao === 'ok';
      const pendente = req.query.pendente;

      res.render('material/index', {
        materiais,
        categoria: categorias,
        categoriaSelecionada: categoriaId,
        success: solicitacao,
        userRole: req.session.userRole,
        pendente: pendente,
         erro: req.query.erro
      });
    } catch (error) {
      console.error('Erro ao listar materiais:', error);
      res.status(500).send('Erro ao carregar materiais');
    }
  },

  excluirMaterial: async (req, res) => {
    const { n_registro } = req.params;
    try {
      const resultado = await Material.delete(n_registro);
      if (resultado.affectedRows === 0) {
        return res.status(404).send('Material não encontrado');
      }
      res.redirect('/material/pesquisar?success=1');
    } catch (err) {
      // Verifica erro de foreign key (material emprestado ou pendente)
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        // Redireciona com mensagem de erro amigável
        return res.redirect('/material/pesquisar?erro=Material não pode ser excluído pois está em situação de empréstimo ou pendente.');
      }
      console.error('Erro ao excluir material:', err);
      res.status(500).send('Erro ao excluir material');
    }
  },

  renderEditForm: async (req, res) => {
    const { n_registro } = req.params;
    try {
      const material = await Material.findById(n_registro);
      const categoria = await Categoria.getAll();

      if (!material) {
        return res.status(404).send('Material não encontrado');
      }

      res.render('material/edit', {
        material,
        categoria,
        error: null,
        userRole: req.session.userRole // Adicionado
      });
    } catch (err) {
      console.error('Erro ao carregar formulário de edição:', err);
      res.status(500).send('Erro interno');
    }
  },

  updateMaterial: async (req, res) => {
    const { n_registro } = req.params;
    const {
      titulo, autor, editora, ano_publi, ISBN, idioma,
      n_paginas, tipo, prateleira, data_aquisicao,
      preco, quantidade, categoria
    } = req.body;

    const updatedMaterial = {
      titulo, autor, editora, ano_publi, ISBN, idioma,
      n_paginas, tipo, prateleira, data_aquisicao,
      preco, quantidade, categoria
    };

    try {
      const resultado = await Material.update(n_registro, updatedMaterial);

      if (!resultado) {
        return res.status(404).send('Material não encontrado');
      }

      res.redirect('/material/pesquisar');
    } catch (err) {
      console.error('Erro ao atualizar material:', err);
      res.status(500).send('Erro interno ao atualizar material');
    }
  },

  verMaterial: async (req, res) => {
  const { n_registro } = req.params;
  try {
    const material = await Material.findById(n_registro);

    if (!material) {
      return res.status(404).send('Material não encontrado');
    }

    // Consulta empréstimos diretamente
    const [emprestimos] = await db.promise().query(
      'SELECT status FROM emprestimos WHERE n_registro = ?', [n_registro]
    );
    let situacao = 'disponivel';
    if (emprestimos.some(e => e.status === 'pendente' || e.status === 'autorizado')) {
      situacao = 'indisponivel';
    }
    material.situacao = situacao;

    res.render('material/ver', { material, userRole: req.session.userRole });
  } catch (err) {
    console.error('Erro ao carregar material:', err);
    res.status(500).send('Erro interno');
  }
},
};

module.exports = materialController;