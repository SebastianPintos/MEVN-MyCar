var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  Duration: {type: String},
  Price: {type: Number},
  Created_at: {type: Date},
  Status: {type: String},
  Domain: {type: String},
  AppointmentTime: {type: Date},
  Client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  BranchOffice: {
    type: Schema.Types.ObjectId,
    required: true,
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
  }
});

var reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = reservation;