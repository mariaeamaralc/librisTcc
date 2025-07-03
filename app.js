const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(methodOverride('_method'));


app.use(session({
  secret: 'senha',
  resave: false,
  saveUninitialized: false,
}));


  app.use((req, res, next) => {
  console.log('URL:', req.path);
  res.locals.userId = req.session.userId || null;
  res.locals.isLoginPage = req.path === '/login';
  console.log('isLoginPage:', res.locals.isLoginPage);
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
