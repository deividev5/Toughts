const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  // Exibe o formulário de login
  static login(req, res) {
    res.render('auth/login');
  }

  // Processa os dados enviados pelo formulário de login
  static async loginPost(req, res) {
    const { email, password } = req.body;

    // Procura um usuário com o e-mail informado
    const user = await User.findOne({ where: { email } });

    // Se não encontrar o usuário, exibe mensagem de erro
    if (!user) {
      req.flash('message', 'Usuário não encontrado');
      res.render('auth/login');
      return;
    }

    // Compara a senha informada com a senha salva no banco (criptografada)
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash('message', 'Senha incorreta');
      res.render('auth/login');
      return;
    }

    // Se estiver tudo certo, salva o ID do usuário na sessão
    req.session.userid = user.id;
    req.flash('message', 'Login realizado com sucesso!');

    // Redireciona para a página principal após salvar a sessão
    req.session.save(() => {
      res.redirect('/');
    });
  }

  // Exibe o formulário de registro (cadastro)
  static register(req, res) {
    res.render('auth/register');
  }

  // Processa os dados enviados pelo formulário de registro
  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // Verifica se as senhas informadas são iguais
    if (password !== confirmPassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!');
      res.render('auth/register');
      return;
    }

    // Verifica se já existe um usuário com o e-mail informado
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      req.flash('message', 'O e-mail já está em uso!');
      res.render('auth/register');
      return;
    }

    // Gera um salt e criptografa a senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Cria o objeto com os dados do novo usuário
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      // Salva o usuário no banco de dados
      const createdUser = await User.create(user);

      // Armazena o ID do novo usuário na sessão
      req.session.userid = createdUser.id;
      req.flash('message', 'Cadastro realizado com sucesso!');

      // Redireciona para a home após salvar a sessão
      req.session.save(() => {
        res.redirect('/');
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Faz logout do usuário e encerra a sessão
  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
};
