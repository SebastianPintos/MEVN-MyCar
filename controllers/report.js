ctrl = {};
const helperReport = require('../lib/helperReport');

ctrl.IncomeExpenses = async (req, res) => {
    var dateStart = req.body.dateStart;
    var dateFinish = req.body.dateFinish;
    var income = await helperReport.TotalSell(dateStart, dateFinish);
    var expenses = await helperReport.Expenses(dateStart, dateFinish);
    if(income && expenses){
        res.status(200).json({income, expenses});
    }else {
        res.status(401).json({title: 'Error al generar los reportes'});
    }
}

ctrl.IncomeDiscriminated = async (req, res) => {
    var dateStart = req.body.dateStart;
    var dateFinish = req.body.dateFinish;

    var incomeDiscriminated = await helperReport.Discriminated(dateStart, dateFinish);

    if(incomeDiscriminated){
        res.status(200).json({incomeDiscriminated});
    }
    else{
        res.status(401).json({title: 'Error al generar los reportes'});
    }
}

ctrl.BestSeller = async (req, res) => {
    var dateStart = req.body.dateStart;
    var dateFinish = req.body.dateFinish;
    var bestSeller = await helperReport.bestSeller(dateStart, dateFinish);

    if(bestSeller){
        res.status(200).json({bestSeller});
    }
    else{
        res.status(401).json({title: 'Error al generar los reportes'});
    }
}

module.exports = ctrl;