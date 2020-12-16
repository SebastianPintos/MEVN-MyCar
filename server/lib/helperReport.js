const Sell = require('../models/sell');
const PurchaseOrder = require('../models/purchaseOrder');

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
            console.log(purchaseDB);
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

ctrl.Discriminated = async (Start, Finish) => {

    var dateStart = new Date(Start);
    var dateFinish = new Date(Finish);
    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);

    await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish}}, (err, sellsDB) => {
        if(err){console.log(err)}
        else{
            console.log(sellsDB[0]);
            console.log(sellsDB[0].VehicleSold);
            console.log(sellsDB[0].VehicleSold.VehicleStock);
            var sells = sellsDB;
        }
    }).populate({
        path: 'VehicleSold',
        model: 'DeliveryVehicle',
        populate: {path: 'VehicleStock', model: 'VehicleStock', populate: {
            path: 'Vehicle', model: 'Vehicle'
        }}
    });
    

    

}

module.exports = ctrl;
