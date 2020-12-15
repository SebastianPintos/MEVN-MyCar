ctrl = {};
const helperReport = require('../lib/helperReport');

ctrl.IncomeExpenses = async (req, res) => {
    var date = req.body.date;
    var income = await helperReport.TotalSell(date);
    var expenses = await helperReport.Expenses(date);
    if(income && expenses){
        res.status(200).json({income, expenses});
    }else {
        res.status(401).json({title: 'Error al generar los reportes'});
    }
}

module.exports = ctrl;