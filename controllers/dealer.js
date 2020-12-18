const ctrl = {};
var Dealer = require('../models/dealer');

ctrl.index = (req, res) => {
    Dealer.find((err, dealer) => {
        if (err) {console.log(err)}
        res.send({
            dealer: dealer
        })
    })
};

ctrl.getOne = (req, res) => {
    var id = req.params.dealer_id;
    Dealer.findById(id, (err, dealer) => {
        if (err) {console.log(err)}
        res.send({
            dealer: dealer
        })
    });
}

ctrl.create = (req, res) => {
    var body = req.body.dealer;
    console.log(req.body.dealer);
    var dealer = new Dealer({
        Name: body.Name,
        Phone: body.Phone,
        Email: body.Email,
        Address: body.Address,
        Status: 'ACTIVE',
        Kind: body.Kind
    });

    dealer.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.dealer_id;
    var body = req.body.dealer;
    Dealer.findOne({_id: id}, (err, dealer) => {
        if(err) {console.log(err)}
        else {
            if(!dealer) {console.log(' no se encontro')}
            else {
                dealer.Name= body.Name;
                dealer.Phone= body.Phone;
                dealer.Email= body.Email;
                dealer.Address = body.Address;
                dealer.Status = body.Status;
                dealer.Kind = body.Kind

                dealer.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.remove = (req, res) => {
    var id = req.params.dealer_id;
    Dealer.findOne({_id: id}, (err, dealer) => {
        if(err) {console.log(err)}
        else {
            if(!dealer) {console.log(' no se encontro')}
            else {
                dealer.Status = 'INACTIVE';

                dealer.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true

                    })
                });
            }
        }
    })
};


module.exports = ctrl;