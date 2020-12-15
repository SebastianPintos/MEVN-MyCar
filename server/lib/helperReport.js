const Sell = require('../models/sell');
ctrl = {};

ctrl.TotalSell = async (req, res) => {
    var dateStart = new Date(req.params.date);
    var dateFinish = new Date(req.params.date);
    var sells = [];

    dateStart.setHours(00, 00, 00);
    dateFinish.setHours(23, 00, 00);
    var report = [];

    Sell.find({createdAt: {'$gte': dateStart, '$lte': dateFinish }}, (err, sellsDB) => {
        if(err){console.log(err)}
        else{
                       
            var office = sellsDB[0].BranchOffice;
            var totalMoney = 0;
            for(i = 0; i < sellsDB.length; i++){
                if(office === sellsDB[i].BranchOffice){
                     totalMoney += sellsDB[i].Factura.PrecioNeto;
                }else{
                    var branchTotal = { id: office, money: totalMoney};
                    report.push(branchTotal);
                    office = sellsDB[i].BranchOffice;
                    totalMoney = sellsDB[i].Factura.PrecioNeto;
                }
            }
        }
    }).sort('BranchOffice').populate('Factura');

}
