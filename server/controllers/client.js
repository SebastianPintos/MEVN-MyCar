const ctrl = {};

ctrl.index = (req, res) => {
    res.send('Client index');
};

ctrl.create = (req, res) => {
    res.send('Client add');
};

ctrl.remove = (req, res) => {
    res.send('Client delete');
};

module.exports = ctrl;
