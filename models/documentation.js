var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocumentationSchema = new Schema({
        Name: {type: String, required: true},
        EstimatedTime: {type: Number},
        Origin: {type: String, enum: ['NACIONAL', 'IMPORTADO','GENERAL','USADO'], required: true},
        BranchOffice: {type: Schema.Types.ObjectId, ref: 'BranchOffice'},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    });

var documentation = mongoose.model("Documentation",DocumentationSchema);
module.exports = documentation; 