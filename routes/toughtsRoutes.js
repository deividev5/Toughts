const express = require('express')
const Tought = require('../models/Tought')
const router =  express.Router()
const ToughtsController = require('../controllers/ToughtsController')
const CheckAuth =  require('../helpers/auth').checkAuth
//controller 

router.post('/remove',CheckAuth,ToughtsController.removeTought)
router.get('/edit/:id',CheckAuth,ToughtsController.updateTought)
router.post('/edit',CheckAuth,ToughtsController.updateToughtSave)
router.post('/add',CheckAuth,ToughtsController.createToughtSave)
router.get('/add',CheckAuth,ToughtsController.createTought)
router.get('/dashboard',CheckAuth,ToughtsController.dashboard)
router.get('/',ToughtsController.showToughts)


module.exports = router