var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  Duration: {type: Number},
  Price: {type: Number},
  Status: {type: String, enum: ['ACTIVE', 'CLOSED', 'CANCEL']},
  Domain: {type: String},
  AppointmentTime: {type: Date},
  Client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  BranchOffice: {
    type: Schema.Types.ObjectId,
    ref: 'BranchOffice'
  },
  Details: {type: String},
  Service: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Service'
  }],
  Vehicle: {
    VehicleID: {type: Schema.Types.ObjectId, ref: 'Vehicle'},
    Domain: {type: String}
  },
  Remainder1: {type: Boolean},
  Remainder2: {type: Boolean},
}, {timestamps: true});

var reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = reservation;