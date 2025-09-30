const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');
const db = require('../config/database');

const materialController = {
  // Renderiza a página de registro de material
  renderRegistrarMaterial: async (req, res) => {
    try {
      const categorias = await Categoria.getAll();
      res.render('material/registrar', {
        error: null,
        material: {},
        categoria: categorias,
        userRole: req.session.userRole
      });
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      res.status(500).send('Erro interno ao buscar categorias');
    }
  },

  // Registrar material
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
        const categorias = await Categoria.getAll();
        return res.render('material/registrar', {
          error: 'Número de registro já existe.',
          material: newMaterial,
          categoria: categorias,
          userRole: req.session.userRole
        });
      }
      console.error('Erro ao registrar material:', err);
      res.status(500).send('Erro ao registrar material');
    }
  },

  // Listar materiais filtrando por categoria
  listarMateriais: async (req, res) => {
    try {
      const pagina = parseInt(req.query.pagina, 10) || 1;
      const limite = 10;
      const categoriaSelecionada = req.query.categoria || null;
      const categorias = await Categoria.getAll();

      const { materiais, totalItens } = await Material.getMateriaisPaginados(pagina, limite, categoriaSelecionada);
      const totalPaginas = Math.ceil(totalItens / limite);

      res.render('material/index', {
        materiais,
        categoria: categorias,
        categoriaSelecionada,
        paginaAtual: pagina,
        totalPaginas,
        success: req.query.success === '1',
        userRole: req.session.userRole,
        pendente: req.query.pendente,
        erro: req.query.erro,
        query: ''
      });

    } catch (err) {
      console.error('Erro ao listar materiais:', err);
      res.status(500).send('Erro ao carregar materiais');
    }
  },

  // Pesquisar no acervo
  renderPesquisarAcervo: async (req, res) => {
    try {
      const termo = req.query.query || '';
      const pagina = parseInt(req.query.pagina, 10) || 1;
      const limite = 10;
      const offset = (pagina - 1) * limite;

      const categorias = await Categoria.getAll();

      if (termo) {
        const result = await Material.buscarPorTermoPaginado(termo, pagina, limite);
        const totalPaginas = Math.ceil(result.total / limite);

        return res.render('material/index', {
          materiais: result.rows,
          categoria: categorias,
          categoriaSelecionada: null,
          paginaAtual: pagina,
          totalPaginas,
          success: req.query.success === '1',
          userRole: req.session.userRole,
          pendente: req.query.pendente,
          erro: req.query.erro,
          query: termo
        });
      }

      const materiais = await Material.buscarTodosPaginado(limite, offset);
      const totalItens = await Material.contarTodos();
      const totalPaginas = Math.ceil(totalItens / limite);

      res.render('material/index', {
        materiais,
        categoria: categorias,
        categoriaSelecionada: null,
        paginaAtual: pagina,
        totalPaginas,
        success: req.query.success === '1',
        userRole: req.session.userRole,
        pendente: req.query.pendente,
        erro: req.query.erro,
        query: termo
      });

    } catch (err) {
      console.error('Erro ao pesquisar acervo:', err);
      res.status(500).send('Erro interno ao pesquisar acervo');
    }
  },

  // Visualizar material
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

  // Formulário de edição
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

  // Atualizar material
  updateMaterial: async (req, res) => {
    const { n_registro } = req.params;
    const updatedMaterial = req.body;

    try {
      const resultado = await Material.update(n_registro, updatedMaterial);
      if (!resultado) return res.status(404).send('Material não encontrado');

      res.redirect('/material/pesquisar');
    } catch (err) {
      console.error('Erro ao atualizar material:', err);
      res.status(500).send('Erro interno ao atualizar material');
    }
  },

  // Excluir material
  excluirMaterial: async (req, res) => {
    const { n_registro } = req.params;

    try {
      const [rows] = await db.promise().query(
        "SELECT * FROM emprestimos WHERE n_registro = ? AND data_devolucao IS NULL",
        [n_registro]
      );

      if (rows.length > 0) {
        return res.redirect('/material/pesquisar?erro=Material não pode ser excluído pois está em situação de empréstimo ou pendente.');
      }

      const resultado = await Material.delete(n_registro);

      if (resultado.affectedRows === 0) {
        return res.status(404).send('Material não encontrado');
      }

      res.redirect('/material/pesquisar?success=1');

    } catch (err) {
      console.error('Erro ao excluir material:', err);
      res.status(500).send('Erro ao excluir material');
    }
  }
};

module.exports = materialController;
