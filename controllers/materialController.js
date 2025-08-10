const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');

const materialController = {
  // 1️⃣ Renderiza o formulário de registro com categoria
  renderRegistrarMaterial: async (req, res) => {
    try {
      const categoria = await Categoria.getAll();
      res.render('material/registrar', {
        error: null,
        material: {},
        categoria
      });
    } catch (err) {
      console.error('Erro ao buscar categoria:', err);
      res.status(500).send('Erro interno ao buscar categoria');
    }
  },

  // 2️⃣ Processa o registro do material
  registrarMaterial: async (req, res) => {
    const {
      n_registro, idioma, isbn, autor,
      data_aquisicao, prateleira, titulo,
      n_paginas, tipo, editora, ano_publi, categoria
    } = req.body;

    if (!n_registro || !titulo) {
      return res.status(400).send('Número de registro e título são obrigatórios');
    }

    const newMaterial = {
      n_registro, idioma, isbn, autor,
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
            categoria
          });
        } catch (catErr) {
          return res.status(500).send('Erro interno ao buscar categoria');
        }
      }
      console.error('Erro ao registrar material:', err);
      res.status(500).send('Erro ao registrar material');
    }
  },

  // 3️⃣ Renderiza lista de materiais com ou sem filtro por número
  renderPesquisarAcervo: async (req, res) => {
    const { n_registro } = req.query;
    try {
      let materiais = [];

      if (n_registro) {
        const material = await Material.findById(n_registro);
        if (material) materiais.push(material);
      } else {
        materiais = await Material.getAll();
      }

      const categoria = await Categoria.getAll();

      res.render('material/index', {
        materiais,
        categoria,
        categoriaSelecionada: null,
        success: req.query.success === '1'
      });

    } catch (err) {
      console.error('Erro ao buscar acervo:', err);
      res.status(500).send('Erro interno ao buscar acervo');
    }
  },

  // 4️⃣ Exclui um material pelo número de registro
  excluirMaterial: async (req, res) => {
    const { n_registro } = req.params;
    try {
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