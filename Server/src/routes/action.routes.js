const {Router} = require ('express')
const router = Router()

const actionCtrl = require('../controllers/action.controller')

router.get('/action/', actionCtrl.getActions)
router.post('/action/', actionCtrl.createActions)
router.get('/action/assistant/:assistantId', actionCtrl.getActionByAssistant)
router.delete('/action/assistant/:assistantId', actionCtrl.deleteActionByAssistant)
router.get('/action/:id', actionCtrl.getAction)
router.put('/action/:id', actionCtrl.editAction)
router.delete('/action/:id', actionCtrl.deleteAction)


module.exports = router