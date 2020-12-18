const Sell = require('../models/sell');
const PurchaseOrder = require('../models/purchaseOrder');
const DeliveryVehicle = require('../models/deliveryVehicle');
const PurchaseOrderV = require('../models/purchaseOrderV');
const VehicleStock = require('../models/vehicleStock');
const Service = require('../models/service');
const BranchOffice = require('../models/branchOffice');
const ProductStock = require('../models/productStock');
const Employee = require('../models/employee');


ctrl = {};

ctrl.TotalSell = async (Start, Finish) => {
    var report = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);

    await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, sellsDB) => {
        if(err){console.log(err)}
        else{
            var office = sellsDB[0].BranchOffice._id.toString();
            var officeName = sellsDB[0].BranchOffice.Name;
            var totalMoney = 0;
            for(nn = 0; nn < sellsDB.length; nn++){
                if(office === sellsDB[nn].BranchOffice._id.toString()){
                    totalMoney += sellsDB[nn].Factura.PrecioNeto;
                }else{
                    var branchTotal = { id: office, name: officeName, money: totalMoney};
                    report.push(branchTotal);
                    office = sellsDB[nn].BranchOffice._id.toString();
                    officeName = sellsDB[nn].BranchOffice.Name;
                    totalMoney = sellsDB[nn].Factura.PrecioNeto;
                }
            }
            var branchTotal = { id: office, name: officeName, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice').populate('Factura BranchOffice');

    return report;

}

ctrl.Expenses = async (Start, Finish) => {
    var expenses = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var report = [];

    await PurchaseOrder.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, purchaseDB) => {
        if(err){console.log(err)}
        else{
            var office = purchaseDB[0].BranchOffice._id.toString();
            var officeName = purchaseDB[0].BranchOffice.Name;
            var totalMoney = 0;
            for(hh = 0; hh < purchaseDB.length; hh++){
                if(office === purchaseDB[hh].BranchOffice._id.toString()){
                    totalMoney += purchaseDB[hh].Price;
                }else{
                    var branchTotal = { id: office, name: officeName, money: totalMoney};
                    report.push(branchTotal);
                    office = purchaseDB[hh].BranchOffice._id.toString();
                    officeName = purchaseDB[hh].BranchOffice.Name;
                    totalMoney = purchaseDB[hh].Price;
                }
            }
            var branchTotal = { id: office, name: officeName, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice').populate('BranchOffice');

    return report;

}

ctrl.Discriminated = async (Start, Finish) => {

    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var sell = await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish}}).populate('BranchOffice').populate('ProductStock').populate('VehicleSold').exec();
    var branch = await BranchOffice.find().select('Name').exec();
    console.log('branch entera',branch);
    var reportService = [];
    for(i= 0; i < branch.length; i++){
        console.log('lenght branch', branch.length)
        var moneyService = 0;
        for(y= 0; y < sell.length; y++){
            console.log('branch', i + ' '+branch[i]);
            if(sell[y].BranchOffice._id.toString() === branch[i]._id.toString()){
                if(sell[y].Service){
                    moneyService += await ctrl.getMoneyFromService(sell[y].Service); 
                }
            }
        }
        console.log('iterador antes de guardar', i)
        var branchService = {id: branch[i]._id, name: branch[i].Name, Service: moneyService};
        reportService.push(branchService);
    }
    console.log(reportService);

    var reportProduct = [];
    for(p = 0; p < reportService.length; p++){
        var moneyProduct = 0;
        for(t= 0; t < sell.length; t++){
            if(sell[t].BranchOffice._id.toString() === reportService[p].id.toString()){
                if(sell[t].ProductStock){
                    moneyProduct += await ctrl.getMoneyFromProduct(sell[t].ProductStock);
                }
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
                if(sell[e].VehicleSold){
                    moneyVehicle += await ctrl.getMoneyfromDelivery(sell[e].VehicleSold);
                }
            }
        }
        var branchVehicle = {id: reportProduct[r].id, name: reportProduct[r].name, service: reportProduct[r].service, product: reportProduct[r].product, vehicle: moneyVehicle};
        reportVehicle.push(branchVehicle);
    }

    return reportVehicle;
}

ctrl.bestSeller = async (Start, Finish) => {
    var report = [];
    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    
    var sells = await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish}})
                .populate('Factura').exec();
    var employee = await Employee.find().exec();

    for(var u = 0; u < employee.length; u++){
        var moneyEmployee = 0;
        for(var n = 0; n < sells.length; n++){
            if(employee[u]._id.toString() === sells[n].Employee.toString()){
                moneyEmployee += sells[n].Factura.PrecioNeto;
            }
        }
        var sellEmployee = {id: employee[u]._id, name: employee[u].Name, lastName: employee[u].LastName, sells: moneyEmployee};
        report.push(sellEmployee);
    }

    var maxSell = report[0];
    for(var m = 0; m < report.length; m++){
        if(maxSell.sells < report[m].sells){
            maxSell = report[m];
        }
    }
    return maxSell;
}

ctrl.getMoneyfromDelivery  = async (delivery) => {
    var totalMoney = 0;
    for(q = 0; q < delivery.length; q++){
        if(delivery[q].VehicleStock){
            await VehicleStock.findOne({_id: delivery[q].VehicleStock}, (err, vehicle)=> {
                totalMoney += vehicle.Vehicle.SuggestedPrice;
            }).populate('Vehicle');
        }
    
        if(delivery[q].PurchaseOrderV){
            await PurchaseOrderV.findOne({_id: delivery[q].PurchaseOrderV}, (err, order) => {
                totalMoney += order.Price;
            })
        }
    }
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

module.exports = ctrl;
