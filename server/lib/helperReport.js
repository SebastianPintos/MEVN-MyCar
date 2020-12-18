const Sell = require('../models/sell');
const PurchaseOrder = require('../models/purchaseOrder');
const DeliveryVehicle = require('../models/deliveryVehicle');
const PurchaseOrderV = require('../models/purchaseOrderV');
const VehicleStock = require('../models/vehicleStock');
const Service = require('../models/service');
const BranchOffice = require('../models/branchOffice');
const ProductStock = require('../models/productStock');

ctrl = {};

ctrl.TotalSell = async (Start, Finish) => {
    var sells = [];
    var report = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    console.log(dateStart);
    console.log(dateFinish);

    await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, sellsDB) => {
        if(err){console.log(err)}
        else{
            console.log(sellsDB);
            var office = sellsDB[0].BranchOffice._id.toString();
            var officeName = sellsDB[0].BranchOffice.Name;
            var totalMoney = 0;
            for(i = 0; i < sellsDB.length; i++){
                console.log('office', office);
                console.log('branch', sellsDB[i].BranchOffice._id);
                if(office === sellsDB[i].BranchOffice._id.toString()){
                    totalMoney += sellsDB[i].Factura.PrecioNeto;
                    console.log('total money' ,  totalMoney);
                    console.log('precio neto' ,  sellsDB[i].Factura.PrecioNeto);
                }else{
                    var branchTotal = { id: office, name: officeName, money: totalMoney};
                    report.push(branchTotal);
                    office = sellsDB[i].BranchOffice._id.toString();
                    officeName = sellsDB[i].BranchOffice.Name;
                    totalMoney = sellsDB[i].Factura.PrecioNeto;
                }
            }
            var branchTotal = { id: office, name: officeName, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice').populate('Factura BranchOffice');

    console.log(report);
    return report;

}

ctrl.Expenses = async (Start, Finish) => {
    var expenses = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var report = [];
    console.log(dateStart);
    console.log(dateFinish);

    await PurchaseOrder.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, purchaseDB) => {
        if(err){console.log(err)}
        else{
            console.log(purchaseDB[0]);
            console.log(purchaseDB[0].BranchOffice);
            var office = purchaseDB[0].BranchOffice._id.toString();
            var officeName = purchaseDB[0].BranchOffice.Name;
            var totalMoney = 0;
            for(i = 0; i < purchaseDB.length; i++){
                console.log('office', office);
                console.log('branch', purchaseDB[i].BranchOffice._id);
                if(office === purchaseDB[i].BranchOffice._id.toString()){
                    totalMoney += purchaseDB[i].Price;
                    console.log('total money' ,  totalMoney);
                    console.log('precio neto' ,  purchaseDB[i].Price);
                }else{
                    var branchTotal = { id: office, name: officeName, money: totalMoney};
                    report.push(branchTotal);
                    office = purchaseDB[i].BranchOffice._id.toString();
                    officeName = purchaseDB[i].BranchOffice.Name;
                    totalMoney = purchaseDB[i].Price;
                }
            }
            var branchTotal = { id: office, name: officeName, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice').populate('BranchOffice');

    console.log(report);
    return report;

}

/* ctrl.Discriminated = async (Start, Finish) => {

    var report = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);

    await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish}}, async (err, sellsDB) => {
        if(err){console.log(err)}
        else{
            var office = sellsDB[0].BranchOffice._id.toString();
            var officeName = sellsDB[0].BranchOffice.Name;
            var totalMoney = 0;

            for(i = 0; i < sellsDB.length; i++){
                console.log('antes de empezar', i + " " + sellsDB[i]);
                await DeliveryVehicle.findOne({_id: sellsDB[i].VehicleSold}, async (err, delivery)=> {
                    if(office === sellsDB[i].BranchOffice._id.toString()){
                        totalMoney += await ctrl.getMoneyfromDelivery(delivery);
                    }
                    else {
                        var branchVehicleSell = {id: office, name: officeName, money: totalMoney};
                        report.push(branchVehicleSell);
                        office = sellsDB[i].BranchOffice._id.toString();
                        officeName = sellsDB[i].BranchOffice.Name;
                        totalMoney = await ctrl.getMoneyfromDelivery(delivery);
                    }
                })
            }
            console.log('reporte', report);

        }
    }).sort('BranchOffice').populate('BranchOffice');
    /* .populate({
        path: 'VehicleSold',
        model: 'DeliveryVehicle',
        populate: [{
            path: 'VehicleStock', 
            model: 'VehicleStock', 
            populate: {
                path: 'Vehicle', 
                model: 'Vehicle'
        }},
        {
            path: 'PurchaseOrderV',
            model: 'PurchaseOrderV',
            Populate: {
                path: 'Vehicle.VehicleID',
                model: 'Vehicle'
            }
        }]
    }); */
    

    

/* } */ 

ctrl.Discriminated = async (Start, Finish) => {

    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var sell = await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish}}).populate('BranchOffice').populate('ProductStock').populate('VehicleSold').exec();
    var branch = await BranchOffice.find().select('Name').exec();
    var reportService = [];
    for(i= 0; i < branch.length; i++){
        var moneyService = 0;
        for(y= 0; y < sell.length; y++){
            if(sell[y].BranchOffice._id.toString() === branch[i]._id.toString()){
                moneyService += await ctrl.getMoneyFromService(sell[y].Service); 
            }
        }
        var branchService = {id: branch[i]._id, name: branch[i].Name, Service: moneyService};
        reportService.push(branchService);
    }
    console.log(reportService);

    var reportProduct = [];
    for(p = 0; p < reportService.length; p++){
        var moneyProduct = 0;
        for(t= 0; t < sell.length; t++){
            if(sell[t].BranchOffice._id.toString() === reportService[p].id.toString()){
                moneyProduct += await ctrl.getMoneyFromProduct(sell[t].ProductStock);
            }
        }
        var branchProduct = {id: reportService[p].id, name: reportService[p].name, service: reportService[p].Service, product: moneyProduct};
        reportProduct.push(branchProduct);
    }
    console.log(reportProduct);

    var reportVehicle = [];
    for(r = 0; r < reportProduct.length; r++){
        var moneyVehicle = 0;
        for(e = 0; e < sell.length; e++){
            if(sell[e].BranchOffice._id.toString() === reportProduct[r].id.toString()){
                moneyVehicle += await ctrl.getMoneyfromDelivery(sell[e].VehicleSold);
            }
        }
        var branchVehicle = {id: reportProduct[r].id, name: reportProduct[r].name, service: reportProduct[r].service, product: reportProduct[r].product, vehicle: moneyVehicle};
        reportVehicle.push(branchVehicle);
    }

    return reportVehicle;
}

ctrl.getMoneyfromDelivery  = async (delivery) => {
    var totalMoney = 0;
    for(q = 0; q < delivery.length; q++){

        console.log(delivery[q]);

        if(delivery[q].VehicleStock){
            await VehicleStock.findOne({_id: delivery[q].VehicleStock}, (err, vehicle)=> {
                console.log('vehiculo', vehicle);
                totalMoney += vehicle.Vehicle.SuggestedPrice;
            }).populate('Vehicle');
            console.log('vehicle stock', totalMoney);
        }
    
        if(delivery[q].PurchaseOrderV){
            await PurchaseOrderV.findOne({_id: delivery[q].PurchaseOrderV}, (err, order) => {
                console.log('order', order);
                totalMoney += order.Price;
            })
        }
    }
    
    console.log(totalMoney);
    return totalMoney;
}

ctrl.getMoneyFromProduct =  async (products) => {
    var money = 0;
    for(k = 0; k < products.length; k++){
        await ProductStock.findOne({_id: products[k]}, (err, productDB) => {
            money += productDB.Product.SalePrice;
        }).populate('Product');
    }
    return money;
}

ctrl.getMoneyFromService = async (service) => {
    var money = 0;
    for(j = 0; j < service.length; j++){
        await Service.findOne({_id: service[j]}, (err, serviceDB) => {
            for(x = 0; x < serviceDB.Product.length; x++){
                money += serviceDB.Product[x].SalePrice;
            }
            money += serviceDB.LaborPrice;
        }).populate('Product');
    }

    return money;
}


  /*               console.log('delivery', i + '' + delivery);
                    if(delivery.PurchaseOrderV){
                        await PurchaseOrderV.findOne({_id: delivery.PurchaseOrderV}, (err, order) => {
                            console.log('con order',i +" "+ order.Price);
                            if(office === sellsDB[i].BranchOffice._id.toString()){
                                totalMoney += order.Price;
                            }
                            else {
                                var branchTotal = { id: office, name: officeName, money: totalMoney};
                                report.push(branchTotal);
                                office = sellsDB[i].BranchOffice._id.toString();
                                officeName = sellsDB[i].BranchOffice.Name;
                                totalMoney = order.Price;
                            }
                        })
                    }else {
                        await VehicleStock.findOne({_id: delivery.VehicleStock}, (err, vehicle) => {
                            console.log('vehiculostock', i + " " +vehicle.Vehicle.SuggestedPrice);
                            if(office === sellsDB[i].BranchOffice._id.toString()){
                                totalMoney += vehicle.Vehicle.SuggestedPrice;
                            }
                            else {
                                var branchTotal = { id: office, name: officeName, money: totalMoney};
                                report.push(branchTotal);
                                office = sellsDB[i].BranchOffice._id.toString();
                                officeName = sellsDB[i].BranchOffice.Name;
                                totalMoney = vehicle.Vehicle.SuggestedPrice;
                            }
                        }).populate('Vehicle')
                    } */

module.exports = ctrl;
