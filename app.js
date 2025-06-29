const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(expressLayouts);
app.use(express.static('public'));


// Usar apenas uma forma de parsear URL encoded (prefira extended: true para melhor suporte)
app.use(express.urlencoded({ extended: true }));

// Também use o body parser json se precisar:
app.use(express.json());

// method-override para suportar PUT e DELETE via formulário
app.use(methodOverride('_method'));

// Sessão (coloque após os middlewares de body para evitar problemas)
app.use(session({
  secret: 'senha', // segredo para sessão
  resave: false,
  saveUninitialized: false
}));

// Middleware para deixar userId disponível nas views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

// Rotas
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
