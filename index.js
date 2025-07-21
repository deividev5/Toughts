// Importando bibliotecas essenciais
const express = require('express') // Framework para criar o servidor web
const exphbs = require('express-handlebars') // Template engine para gerar HTML dinamicamente
const session = require('express-session') // Middleware para gerenciar sessões de usuários
const flash = require('express-flash') // Middleware para exibir mensagens temporárias (ex: sucesso, erro)
const SQLiteStore = require('connect-sqlite3')(session); // Armazena as sessões usando SQLite (persistência local)

const app = express() // Inicializando o app Express

// Conexão com o banco de dados
const conn = require('./db/conn')

// Models do Sequelize (ORM)
const Tought = require('./models/Tought') // Modelo de Pensamentos
const User = require('./models/User') // Modelo de Usuários

// Importando rotas
const toughtRoutes = require('./routes/toughtsRoutes') // Rotas para Pensamentos
const authRoutes = require('./routes/authRoutes') // Rotas para Autenticação

// Importando o controlador principal
const ToughtController = require('./controllers/ToughtController')

// Habilita o uso de JSON nas requisições
app.use(express.json())

// Configura o Handlebars como template engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

// Permite o processamento de dados enviados via formulário
app.use(
  express.urlencoded({
    extended: true,
  })
)

// Configuração da sessão
app.use(
  session({
    name: 'session', // Nome do cookie de sessão
    secret: 'nosso_secret', // Chave secreta para assinar a sessão
    resave: false, // Evita regravar a sessão se ela não for modificada
    saveUninitialized: false, // Evita salvar sessões vazias
    store: new SQLiteStore({
      db: 'sessions.sqlite', // Nome do arquivo onde as sessões serão armazenadas
      dir: __dirname,        // Define que o arquivo será salvo na raiz do projeto
    }),
    cookie: {
      secure: false, // false pois não estamos usando HTTPS (true seria ideal em produção)
      maxAge: 3600000, // Tempo de vida do cookie: 1 hora
      expires: new Date(Date.now() + 3600000), // Define quando o cookie expira
      httpOnly: true, // Impede que o cookie seja acessado via JavaScript no navegador (mais seguro)
    },
  })
)

// Habilita o uso de mensagens temporárias via sessão (flash messages)
app.use(flash())

// Permite servir arquivos estáticos da pasta "public" (CSS, imagens, JS front-end, etc)
app.use(express.static("public"))

// Middleware para disponibilizar os dados da sessão para as views
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session; // Deixa a sessão acessível em qualquer view do Handlebars
  }
  next();
});

// Define as rotas da aplicação
app.use('/toughts', toughtRoutes) // Tudo que for /toughts será tratado por toughtRoutes
app.use('/', authRoutes) // Rotas de autenticação (login, registro, etc)
app.get('/', ToughtController.showToughts) // Rota principal que exibe os pensamentos

// Sincroniza os models com o banco de dados e inicia o servidor
conn
  //.sync({ force: true }) // Descomente para recriar tabelas (apaga dados!)
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000 🚀")
    })
  })
  .catch((err) => console.log("Erro ao conectar com o banco:", err))
