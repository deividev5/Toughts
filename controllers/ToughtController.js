const Tought = require('../models/Tought');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports = class ToughtController {
  // Exibe a página inicial com todos os pensamentos públicos
  static async showToughts(req, res) {
    let search = '';
    let order = 'DESC'; // ordem padrão: mais recente primeiro

    // Se foi feita uma busca, usa o termo informado
    if (req.query.search) search = req.query.search;

    // Se o usuário pediu para ordenar do mais antigo, muda a ordem
    if (req.query.order === 'old') order = 'ASC';

    // Busca os pensamentos com filtro de título e ordenação
    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    });

    // Converte os dados para objetos simples
    const toughts = toughtsData.map(result => result.get({ plain: true }));

    // Verifica se existem pensamentos
    const toughtsQty = toughts.length > 0 ? toughts.length : false;

    // Renderiza a view com os dados
    res.render('toughts/home', { toughts, search, toughtsQty });
  }

  // Exibe o painel do usuário com seus próprios pensamentos
  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    // Se o usuário não for encontrado, redireciona para login
    if (!user) {
      res.redirect('/login');
      return;
    }

    // Extrai os pensamentos do usuário
    const toughts = user.Toughts.map(result => result.dataValues);
    const emptyToughts = toughts.length === 0;

    res.render('toughts/dashboard', { toughts, emptyToughts });
  }

  // Renderiza o formulário de criação de pensamento
  static async createTought(req, res) {
    res.render('toughts/create');
  }

  // Salva o novo pensamento no banco
  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash('message', 'Pensamento criado com sucesso');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Erro ao criar pensamento:', error);
    }
  }

  // Remove um pensamento do banco
  static async removeTought(req, res) {
    const { id } = req.body;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id, UserId } });
      req.flash('message', 'Pensamento removido com sucesso');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Erro ao remover pensamento:', error);
    }
  }

  // Exibe o formulário de edição de um pensamento
  static async updateTought(req, res) {
    const { id } = req.params;

    const tought = await Tought.findOne({ where: { id }, raw: true });
    res.render('toughts/edit', { tought });
  }

  // Salva a edição do pensamento no banco
  static async updateToughtSave(req, res) {
    const { id, title } = req.body;

    try {
      await Tought.update({ title }, { where: { id } });
      req.flash('message', 'Pensamento atualizado com sucesso');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Erro ao atualizar pensamento:', error);
    }
  }
};
