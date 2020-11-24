const ctrl = {};

const Remainder = require('../models/remainderMail');

ctrl.index = (req, res) => {
    Remainder.find((err, remainder) => {
        if (err) {console.log(err)}
        res.send({
            remainder: remainder
        })
    })
}

/* {
    "remainder": {
        "Title": "120",
        "Body": "15000",
        "Interval": {
            "Days": "2",
            "Hours": "0"
        },
        "Status": "ACTIVE"
    }
} */

ctrl.create = (req, res) => {
    var body = req.body.remainder;

    var remaider = new Remainder({
        Title: body.Title,
        Body: body.Body,
        Interval: body.Interval,
        Status: 'ACTIVE'
    })

    remaider.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
}

ctrl.update = (req, res) => {
    var id = req.params.remainder_id;
    var body = req.body.remainder;

    Remainder.findOne({_id: id}, (err, remainder) => {
        if(err) {console.log(req.body.vehicle)}
        else{
            if(!remainder) {console.log(' no se encontro')}
            else{
                remainder.Title = body.Title;
                remainder.Body = body.Body;
                remainder.Interval = body.Interval;
                remainder.Status = body.Status;

                remainder.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
}

module.exports = ctrl;