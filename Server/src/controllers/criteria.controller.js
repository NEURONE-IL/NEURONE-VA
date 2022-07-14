const criteriaCtrl = {}

const Criteria = require('../models/criteria')

criteriaCtrl.getAllCriterias = async(req, res) =>{
    const criterias = await Criteria.find();
    res.json(criterias);
};

criteriaCtrl.createCriterias = async (req,res) => {
    const newCriteria = new Criteria(req.body)
    await newCriteria.save()
    res.send({message: 'Criteria created'});

};

criteriaCtrl.getCriteriaByAssistant = async (req,res) => {
    const criteria = await Criteria.find({assistant: req.params.assistantId});
    res.send(criteria);
};

criteriaCtrl.deleteCriteriaByAssistant = async (req,res) => {
    const criteria = await Criteria.find({assistant: req.params.assistantId});
    for(let criterion of criteria){
        await Criteria.findByIdAndDelete(criterion._id);
    }
    res.send("Eliminando citerios del asistente " + req.params.assistantId);
};

criteriaCtrl.getCriteria = async (req,res) => {
    const criteria = await Criteria.findById(req.params.id)
    res.send(criteria);
};

criteriaCtrl.editCriteria = async(req,res) => {
    await Criteria.findByIdAndUpdate(req.params.id, req.body)
    res.json({status:'updated'})
};

criteriaCtrl.deleteCriteria = async (req,res) => {
    await Criteria.findByIdAndDelete(req.params.id)
    res.json({status:'deleted'})
};

module.exports = criteriaCtrl;