const assistantCtrl = {}

const Assistant = require('../models/assistant')

assistantCtrl.getAssistants = async (req,res) => {
    const assistants = await Assistant.find();
    res.json(assistants);
}
assistantCtrl.getAssistantURL = async (req,res) => {
    const id=req.params.id;
    const assistant = await Assistant.findById({_id: id},(err,assistant) =>{
        if(err){
            return res.json({
                err
            });
        }
        res.send('va.neurone.info/assistant/{{user}}/' + assistant.id + '/{{global}}/{{contexto}}/{{subcontexto}}');
    })
    
}
assistantCtrl.getAssistantIFRAME = async (req,res) => {
    const id=req.params.id;
    const assistant = await Assistant.findById({_id: id},(err,assistant) =>{
        if(err){
            return res.json({
                err
            });
        }
        res.send('<iframe with="350px" height="300px" frameborder="0" style="overflow: hidden; margin: 10px; bottom: 15px; right: 15px; position: fixed" [src]="va.neurone.info/assistant/' + assistant.id + '/' + req.params.user + '/'+ req.params.global + '/' + req.params.context +'/'+req.params.subcontext+'" title="Virtual Asist"></iframe>');
    })
    //res.send('<iframe with="350px" height="300px" frameborder="0" style="overflow: hidden; margin: 10px; bottom: 15px; right: 15px; position: fixed" [src]="va.neurone.info/assistant/' + req.params.user +'/' + assistant.id + '/'+ req.params.global + '/' + req.params.context +'/'+req.params.subcontext+'" title="Virtual Asist"></iframe>');
    
    
}

assistantCtrl.createAssistants = async (req,res) => {
    const newAssistant = new Assistant(req.body)
    await newAssistant.save()
    res.send({_id: newAssistant._id});

};
assistantCtrl.getAssistant = async (req,res) => {
    const assistant = await Assistant.findById(req.params.id)
    res.send(assistant);
};
assistantCtrl.editAssistant = async(req,res) => {
    await Assistant.findByIdAndUpdate(req.params.id, req.body)
    res.json({status:'updated'})
};
assistantCtrl.deleteAssistant = async (req,res) => {
    await Assistant.findByIdAndDelete(req.params.id)
    res.json({status:'deleted'})
};

module.exports = assistantCtrl;