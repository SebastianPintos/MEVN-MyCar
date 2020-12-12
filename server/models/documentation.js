var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocumentationSchema = new Schema({
        Name: {type: String, required: true, unique:true},
        Completed :{type: Boolean},
        EstimatedTime: {type: Number},
        Origin: {type: String, enum: ['NACIONAL', 'IMPORTADO'], required: true},
        Sell: {type: Schema.Types.ObjectId, ref: 'Sell'},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    });

var documentation = mongoose.model("Documentation",DocumentationSchema);
module.exports = documentation; 