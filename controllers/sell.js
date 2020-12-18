const Sell = require('../models/sell');
<<<<<<< HEAD
const helperSell = require('../lib/helperSell');
=======
const helperVehicle = require('../lib/helperVehicle');
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
const helperProduct = require('../lib/helperProduct');
const ctrl = {};

ctrl.listVehicle = (req, res) => {
    Sell.find((err, sell) => {
        if (err) { console.log(err) }
<<<<<<< HEAD
        console.log(sell);
        res.send({
            sell: sell
        })
}).populate('Employee').populate('PaymentType').populate('Factura').populate('Client').populate('VehicleSold');

};
 
=======
        res.send({
            Sell: sell
        })
    }).populate('VehicleSell').populate('PaymentType');
};

>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
/* {
    "sell": {
        "PriceFreeTax": "2000000",
        "Tax": "21",
        "Discount": "0",
        "CompanyName": "Morgue Juanito SRL",
        "CUIT": "20360772528",
        "TaxCategory": "RESPONSABLE INSCRIPTO",
        "Cliente": "5faad8b67e6c362bb0ba3136",
        "Employee": "5fc5404274173634a099be7f",
        "Service": [],
        "ProductStock": [],
        "VehicleSold":[{
            "VehicleStock": "5fc9566be84a6b031cd9a692"
        }],
        "PaymentType": ["5fc94d3138063149f8a977a3"]
    }
} */

ctrl.sellVehicle = async (req, res) => {
    var body = req.body.sell;
    console.log(body);
    
    var sell = new Sell({
<<<<<<< HEAD
        CUIT: body.CUIT,
        Date: body.Date,
        RewarderDiscount: body.RewarderDiscount,
=======
        PriceFreeTax: body.PriceFreeTax,
        Tax: body.Tax,
        Discount: body.Discount,
        RewarderDiscount: body.RewarderDiscount,
        CompanyName: body.CompanyName,
        CUIT: body.CUIT,
        TaxCategory: body.TaxCategory,
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
        Client: body.Client,
        Employee: body.Employee,
        Service: body.Service,
        ProductStock: body.ProductStock,
        VehicleSold: body.VehicleSold,
<<<<<<< HEAD
        PaymentType: body.PaymentType,
        BranchOffice: body.BranchOffice,
        Factura: body.Factura

=======
        PaymentType: body.PaymentType
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
    })

    console.log(sell);

    sell.save(async (err, sellDB) => {
        if(err) {console.log(err)}
        else{ 
<<<<<<< HEAD
            console.log( 'sell', sellDB);
            await helperSell.SellVehicle(sellDB);
            await helperSell.SellProduct(sellDB);
            res.status(200).json(sellDB);
        }
    });
}

ctrl.sellReservation = async (req, res) => {
    var body = req.body.sell;
    
    var sell = new Sell({
        CUIT: body.CUIT,
        Date: body.Date,
        RewarderDiscount: body.RewarderDiscount,
        Client: body.Client,
        Employee: body.Employee,
        Service: body.Service,
        ProductStock: body.ProductStock,
        VehicleSold: body.VehicleSold,
        PaymentType: body.PaymentType,
        BranchOffice: body.BranchOffice,
        Factura: body.Factura
    });

    sell.save(async (err, sellDB) => {
        if(err) {console.log(err)}
        else{ 
            console.log(sellDB);
            await helperSell.SellProductFromReserve(sellDB);
            res.status(200).json(sellDB);
=======
            console.log(sellDB);
            await helperVehicle.SellVehicle(sellDB);
            res.status(200).json({title: 'Venta generada correctamente'});
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
        }
    });
}

module.exports = ctrl;
