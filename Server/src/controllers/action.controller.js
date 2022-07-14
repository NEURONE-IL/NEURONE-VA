const actionCtrl = {};

const Action = require("../models/action");

actionCtrl.getActions = async (req, res) => {
  const actions = await Action.find();
  res.json(actions);
};

actionCtrl.createActions = async (req, res) => {
  const newAction = new Action(req.body);
  await newAction.save();
  res.send({ _id: newAction._id });
};

actionCtrl.getAction = async (req, res) => {
  const action = await Action.findById(req.params.id);
  res.send(action);
};

actionCtrl.getActionByAssistant = async (req, res) => {
  const action = await Action.find({ assistant: req.params.assistantId });
  res.send(action);
};

actionCtrl.deleteActionByAssistant = async (req, res) => {
  const action = await Action.find({ assistant: req.params.assistantId });
  for (let singleAction of action) {
    await Action.findByIdAndDelete(singleAction._id);
  }
  res.send("Eliminado acciones del asistente " + req.params.assistantId);
};

actionCtrl.editAction = async (req, res) => {
  await Action.findByIdAndUpdate(req.params.id, req.body);
  res.json({ status: "updated" });
};

actionCtrl.deleteAction = async (req, res) => {
  let imagesToDelete = [];
  const actionToDelete = await Action.findById(req.params.id);
  if(actionToDelete.type=='chatbot'){
    if(actionToDelete.chatbot != undefined && actionToDelete.chatbot.optionList.length > 0){
      for(let option of actionToDelete.chatbot.optionList){
        if(option.replyType=='image'){
          imagesToDelete.push(option.filename);
        }
        if(option.optionList.length > 0){
          for(let optionlayer2 of option.optionList){
            if(optionlayer2.replyType=='image'){
              imagesToDelete.push(optionlayer2.filename);
            }
            if(optionlayer2.optionList.lenght > 0){
              for(let optionlayer3 of optionlayer2.optionList){
                if(optionlayer3.replyType=='image'){
                  imagesToDelete.push(optionlayer3.filename);
                }
              }
            }
          }
        }
      }

    }
  } 
  if(actionToDelete.type=='avatar'){
    if(actionToDelete.message != undefined){
      imagesToDelete.push(actionToDelete.message.image)
    }
  }
  await Action.findByIdAndDelete(req.params.id);
  res.json({ ToDelete: imagesToDelete });
};

module.exports = actionCtrl;
