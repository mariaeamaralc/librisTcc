const Material = require('../models/materialModel');
const Categoria = require('../models/categoriaModel');

const materialController = {

    createMaterial: (req, res) => {
        const newMaterial = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria
        };

        Material.create(newMaterial, (err, materialId) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/materiais');
        });
    },

    getMaterialById: (req, res) => {
        const materialId = req.params.id;

        Material.findById(materialId, (err, material) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!material) {
                return res.status(404).json({ message: 'Material not found' });
            }
            res.render('materiais/show', { material });
        });
    },
    
    getAllMateriais: (req, res) => {
        const categoria = req.query.categoria || null;
        
        Material.getAll(categoria, (err, materiais) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            Categoria.getAll((err, categorias) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.render('materiais/index', { materiais, categorias, categoriaSelecionada: categoria });
            });
        });
    },

    renderCreateForm: (req, res) => {
        Categoria.getAll((err, categorias) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.render('materiais/create', { categorias });
        });
    },

    renderEditForm: (req, res) => {
        const materialId = req.params.id;

        Material.findById(materialId, (err, material) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!material) {
                return res.status(404).json({ message: 'Material not found' });
            }

            Categoria.getAll((err, categorias) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.render('materiais/edit', { material, categorias });
            });
        });
    },

    updateMaterial: (req, res) => {
        const materialId = req.params.id;
        
        const updatedMaterial = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria
        };

        Material.update(materialId, updatedMaterial, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/materiais');
        });
    },

    deleteMaterial: (req, res) => {
        const materialId = req.params.id;

        Material.delete(materialId, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/materiais');
        });
    }
};

module.exports = materialController;
