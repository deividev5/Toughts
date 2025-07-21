// Middleware para proteger rotas que exigem autenticação
// Verifica se o usuário está logado (via sessão)
module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid;

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!userId) {
    res.redirect('/login');
    return;
  }

  // Se estiver logado, continua para o próximo middleware ou rota
  next();
};
