const {Router} = require ('express')
const router = Router()

const criteriaCtrl = require('../controllers/criteria.controller')

router.get('/criteria/', criteriaCtrl.getAllCriterias)
router.get('/criteria/assistant/:assistantId', criteriaCtrl.getCriteriaByAssistant)
router.delete('/criteria/assistant/:assistantId', criteriaCtrl.deleteCriteriaByAssistant)
router.post('/criteria/', criteriaCtrl.createCriterias)
router.get('/criteria/:id', criteriaCtrl.getCriteria)
router.put('/criteria/:id', criteriaCtrl.editCriteria)
router.delete('/criteria/:id', criteriaCtrl.deleteCriteria)


module.exports = router