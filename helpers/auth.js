// Exporta um objeto com a função checkAuth como uma de suas propriedades
module.exports = {
    checkAuth: function(req, res, next) { // Define a função checkAuth
        const userId = req.session.userid; // Obtém o ID do usuário da sessão
 
        // Verifica se o ID do usuário não está definido na sessão
        if (!userId) {
            // Define uma mensagem de flash informando ao usuário para fazer login
            req.flash('message', 'Você precisa fazer login antes de acessar essa configuração');
            // Redireciona o usuário para a página de login
            return res.redirect('/login');
        }
        // Chama o próximo middleware na cadeia
        next();
    }
};