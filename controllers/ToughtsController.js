const Tought = require('../models/Tought')
const User = require('../models/user')
const {Op} =  require('sequelize')

module.exports = class ToughtsController{
    static async showToughts (req,res){

          let search = ''

        if (req.query.search){
        search =  req.query.search
          }

          let order = 'DESC'

          if(req.query.order === 'old'){
            order = 'ASC'
          }else{
            order = 'DESC'
          }
    

        const toughtData =  await Tought.findAll({
            include:User,
            where:{
                title:{[Op.like]: `%${search}%`},
            },
            order: [['createdAt', order]],
        })
        

        const toughts = toughtData.map((result) => result.get({plain:true}))

        let toughtQty = toughts.length

        if(toughtQty === 0){
            toughtQty = false
        }


        res.render('toughts/home',{toughts, search, toughtQty})
    }

    static  async dashboard (req,res){

        const userId = req.session.userid

        const user = await User.findOne({
          where: {
            id: userId,
          },
          include: Tought,
          plain: true,
        })
    
        const toughts = user.Toughts.map((result) => result.dataValues)
    
        let emptyToughts = true
    
        if (toughts.length > 0) {
          emptyToughts = false
        }
    
        console.log(toughts)
        console.log(emptyToughts)
    
        res.render('toughts/dashboard', { toughts, emptyToughts })

    }

static createTought (req,res){
    res.render('toughts/create')
}


static async createToughtSave (req,res){

const tought = {
    title: req.body.title,
    UserId: req.session.userid,
}

await Tought.create(tought)

try {
    req.flash('message', 'Pensamento criado com sucesso')


    req.session.save(()=> {
        res.redirect('/toughts/dashboard')
    })
} catch (error) {
    console.log('ocorreu um erro' + error)
}

}

static async removeTought (req,res){
    const id = req.body.id
    const UserId = req.session.userid

    try {

        await Tought.destroy({where: {id:id}, UserId:UserId })
        req.flash('message', 'Pensamento removido com sucesso')
    
    
        req.session.save(()=> {
            res.redirect('/toughts/dashboard')
        })
    } catch (error) {
        console.log('ocorreu um erro' + error)
    }
    


}

static async updateTought (req,res){

const id = req.params.id

const tought = await Tought.findOne({where:{id:id}, raw: true})

res.render('toughts/edit', {tought})



}

static async updateToughtSave (req,res){

const id = req.body.id

const tought = {
    title: req.body.title,
}

try {

    await Tought.update(tought,{where:{id:id}})
    req.flash('message', 'Pensamento criado com sucesso')


    req.session.save(()=> {
        res.redirect('/toughts/dashboard')
    })
} catch (error) {
    console.log('ocorreu um erro' + error)
}



}



}