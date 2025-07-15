const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');

const materialController = {
  // Renderiza o formulário de registro com categorias carregadas
  renderRegistrarMaterial: (req, res) => {
    Categoria.getAll((err, categorias) => {
      if (err) {
        console.error('Erro ao buscar categorias:', err);
        return res.status(500).send('Erro interno ao buscar categorias');
      }
      res.render('material/registrar', {
        error: null,
        material: {},
        categorias: categorias
      });
    });
  },

  // Processa o registro do material
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
      categoria: req.body.categoria // Não esquece disso aqui!
    };

    Material.registrar(newMaterial, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return Categoria.getAll((catErr, categorias) => {
            if(catErr) return res.status(500).send('Erro interno');
            res.render('material/registrar', {
              error: 'Número de registro já existe.',
              material: newMaterial,
              categorias: categorias
            });
          });
        }
        return res.status(500).json({ error: err });
      }
      res.redirect('/material/pesquisar?success=1');
    });
  },

  // Renderiza lista de materiais com categorias
  renderPesquisarAcervo: (req, res) => {
    Material.getAll((err, materiais) => {
      if (err) return res.status(500).json({ error: err });

      Categoria.getAll((catErr, categorias) => {
        if (catErr) return res.status(500).json({ error: catErr });

        res.render('material/index', {
          materiais,
          categorias,
          categoriaSelecionada: null,
          success: req.query.success === '1'
        });
      });
    });
  },

  // Outros métodos aqui (getMaterialById, renderEditForm, updateMaterial, deleteMaterial)...

};

module.exports = materialController;
