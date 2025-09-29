const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);




// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'senha',
  resave: false,
  saveUninitialized: false,
}));



// Middleware global para controlar visibilidade de navbar e sessão
app.use((req, res, next) => {
  const path = req.path;
  res.locals.isLoginPage = path === '/login';
  res.locals.isRegisterPage = path === '/register';
  res.locals.usuariosId = req.session.usuariosId || null;
  next();
});

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.userRole = req.session.userRole || null;
  next();
});

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const materialRoutes = require('./routes/materialRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/material', materialRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/', emprestimoRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
