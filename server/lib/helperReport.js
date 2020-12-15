const Sell = require('../models/sell');
const PurchaseOrder = require('../models/purchaseOrder');

ctrl = {};

ctrl.TotalSell = async (date) => {
    var dateStart = new Date(date);
    var dateFinish = new Date(date);
    var sells = [];

    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var report = [];
    console.log(dateStart);
    console.log(dateFinish);

    await Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, sellsDB) => {
        if(err){console.log(err)}
        else{
            console.log(sellsDB);
            var office = sellsDB[0].BranchOffice.toString();
            var totalMoney = 0;
            for(i = 0; i < sellsDB.length; i++){
                console.log('office', office);
                console.log('branch', sellsDB[i].BranchOffice);
                if(office === sellsDB[i].BranchOffice.toString()){
                    totalMoney += sellsDB[i].Factura.PrecioNeto;
                    console.log('total money' ,  totalMoney);
                    console.log('precio neto' ,  sellsDB[i].Factura.PrecioNeto);
                }else{
                    var branchTotal = { id: office, money: totalMoney};
                    report.push(branchTotal);
                    office = sellsDB[i].BranchOffice.toString();
                    totalMoney = sellsDB[i].Factura.PrecioNeto;
                }
            }
            var branchTotal = { id: office, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice').populate('Factura');

    console.log(report);
    return report;

}

ctrl.Expenses = async (date) => {
    var dateStart = new Date(date);
    var dateFinish = new Date(date);
    var expenses = [];

    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var report = [];
    console.log(dateStart);
    console.log(dateFinish);

    await PurchaseOrder.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, purchaseDB) => {
        if(err){console.log(err)}
        else{
            console.log(purchaseDB);
            var office = purchaseDB[0].BranchOffice.toString();
            var totalMoney = 0;
            for(i = 0; i < purchaseDB.length; i++){
                console.log('office', office);
                console.log('branch', purchaseDB[i].BranchOffice);
                if(office === purchaseDB[i].BranchOffice.toString()){
                    totalMoney += purchaseDB[i].Price;
                    console.log('total money' ,  totalMoney);
                    console.log('precio neto' ,  purchaseDB[i].Price);
                }else{
                    var branchTotal = { id: office, money: totalMoney};
                    report.push(branchTotal);
                    office = purchaseDB[i].BranchOffice.toString();
                    totalMoney = purchaseDB[i].Price;
                }
            }
            var branchTotal = { id: office, money: totalMoney};
            report.push(branchTotal);
        }
    }).sort('BranchOffice');

    console.log(report);
    return report;

}

module.exports = ctrl;
