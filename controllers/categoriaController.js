const Categoria = require('../models/categoriaModel');

const categoriaController = {
  createCategoria: async (req, res) => {
    try {
      const newCategoria = { nome: req.body.nome };
      // Supondo que você tenha implementado Categoria.create
      const result = await Categoria.create(newCategoria);
      res.redirect('/categorias');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCategoriaById: async (req, res) => {
    try {
      const categoriaId = req.params.id;
      const categoria = await Categoria.findById(categoriaId);

      if (!categoria) {
        return res.status(404).json({ message: 'Categoria not found' });
      }

      res.render('categorias/show', { categoria, isLoginPage: false, error: null });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.getAll();
      res.render('categorias/index', { categorias, isLoginPage: false, error: null });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  renderCreateForm: (req, res) => {
    res.render('categorias/create', { isLoginPage: false, error: null });
  },

  renderEditForm: async (req, res) => {
    try {
      const categoriaId = req.params.id;
      const categoria = await Categoria.findById(categoriaId);

      if (!categoria) {
        return res.status(404).json({ message: 'Categoria not found' });
      }

      res.render('categorias/edit', { categoria, isLoginPage: false, error: null });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const categoriaId = req.params.id;
      const updatedCategoria = { nome: req.body.nome };

      await Categoria.update(categoriaId, updatedCategoria);
      res.redirect('/categorias');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      const categoriaId = req.params.id;
      await Categoria.delete(categoriaId);
      res.redirect('/categorias');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = categoriaController;