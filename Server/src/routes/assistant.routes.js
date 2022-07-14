const {Router} = require ('express')
const router = Router()

const assistantCtrl = require('../controllers/assistant.controller')

router.get('/assistant/:id', assistantCtrl.getAssistant)
router.get('/assistant/url/:id', assistantCtrl.getAssistantURL)
router.get('/assistant/iframe/:user/:id/:global/:context/:subcontext', assistantCtrl.getAssistantIFRAME)
router.put('/assistant/:id', assistantCtrl.editAssistant)
router.delete('/assistant/:id', assistantCtrl.deleteAssistant)
router.get('/assistant/', assistantCtrl.getAssistants)
router.post('/assistant/', assistantCtrl.createAssistants)
router.get('/ping/', async (req,res) => {
    res.send("pong");}

)

module.exports = router