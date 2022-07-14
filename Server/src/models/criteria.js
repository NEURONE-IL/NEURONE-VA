const {Schema, model} = require('mongoose')


const criterion = new Schema({
    metric: {type: String, required: true},
    condition: {type: String, required: true },
    value: {type: Number, required: true},
});

const criteriaSchema = new Schema({
    name: {type: String, required: true},
    assistant: {type: String, required: true},
    action: {type: String, required: false},
    criteria: {type: [criterion], required: true},
},{
    versionKey: false
});


module.exports = model("Criteria", criteriaSchema);