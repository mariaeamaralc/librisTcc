const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');

const materialController = {
 
  renderMaterialMenu: (req, res) => {
    res.render('material/menu'); // Opcional
  },

  // View para registrar livro
  renderRegistrarMaterial: (req, res) => {
    Categoria.getAll((err, categorias) => {
      if (err) return res.status(500).json({ error: err });
      res.render('material/registrar', {
        categorias,
        error: null,
        material: {}
      });
    });
  },

  // Processa registro de livro
  registrarMaterial: (req, res) => {
    const newMaterial = {
      n_registro: req.body.n_registro,
      idioma: req.body.idioma,
      isbn: req.body.isbn,
      autor: req.body.autor,
      data_aquisicao: req.body.data_aquisicao,
      prateleira: req.body.prateleira,
      titulo: req.body.titulo,
      n_paginas: req.body.n_paginas,
      tipo: req.body.tipo,
      editora: req.body.editora,
      ano_publi: req.body.ano_publi,
      preco: req.body.preco,
      quantidade: req.body.quantidade,
      categoria: req.body.categoria
    };

    Material.registrar(newMaterial, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          Categoria.getAll((catErr, categorias) => {
            if (catErr) return res.status(500).json({ error: catErr });
            res.render('material/registrar', {
              categorias,
              error: 'Número de registro já existe.',
              material: newMaterial
            });
          });
        } else {
          return res.status(500).json({ error: err });
        }
      } else {
        res.redirect('/material/pesquisar');
      }
    });
  },

  // Lista todos os materiais
  renderPesquisarAcervo: (req, res) => {
    const categoria = req.query.categoria || null;

    Material.getAll(categoria, (err, materiais) => {
      if (err) return res.status(500).json({ error: err });
      Categoria.getAll((catErr, categorias) => {
        if (catErr) return res.status(500).json({ error: catErr });
        res.render('material/index', {
          materiais,
          categorias,
          categoriaSelecionada: categoria
        });
      });
    });
  },

  // Detalhes de um material
  getMaterialById: (req, res) => {
    const n_registro = req.params.id;

    Material.findById(n_registro, (err, material) => {
      if (err) return res.status(500).json({ error: err });
      if (!material) return res.status(404).send('Material não encontrado');
      res.render('material/show', { material });
    });
  },

  // Formulário para editar
  renderEditForm: (req, res) => {
    const n_registro = req.params.id;

    Material.findById(n_registro, (err, material) => {
      if (err) return res.status(500).json({ error: err });
      if (!material) return res.status(404).send('Material não encontrado');

      Categoria.getAll((catErr, categorias) => {
        if (catErr) return res.status(500).json({ error: catErr });
        res.render('material/edit', { material, categorias });
      });
    });
  },

  // Atualiza material
  updateMaterial: (req, res) => {
    const n_registro = req.params.id;

    const updatedMaterial = {
      idioma: req.body.idioma,
      isbn: req.body.isbn,
      autor: req.body.autor,
      data_aquisicao: req.body.data_aquisicao,
      prateleira: req.body.prateleira,
      titulo: req.body.titulo,
      n_paginas: req.body.n_paginas,
      tipo: req.body.tipo,
      editora: req.body.editora,
      ano_publi: req.body.ano_publi,
      preco: req.body.preco,
      quantidade: req.body.quantidade,
      categoria: req.body.categoria
    };

    Material.update(n_registro, updatedMaterial, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.redirect('/material/pesquisar');
    });
  },

  // Exclui material
  deleteMaterial: (req, res) => {
    const n_registro = req.params.id;

    Material.delete(n_registro, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.redirect('/material/pesquisar');
    });
  }
};

module.exports = materialController;
