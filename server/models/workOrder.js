var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkOrderSchema = new Schema({
  Status: {type: String},
  StartingTime: {type: Date},
  EndingTime: {type: Date},
  Reservation: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Reservation'
  },
  Employee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Employee'
  },
  Product: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }],
  Service: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Service'
  }]
});

var workOrder = mongoose.model('WorkOrder', WorkOrderSchema);
module.exports = workOrder;