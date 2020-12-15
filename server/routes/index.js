const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const productStock = require('../controllers/productStock');
const purchaseOrder = require('../controllers/purchaseOrder');
const purchaseOrderV = require('../controllers/purchaseOrderV');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');
const dealer = require('../controllers/dealer');
const service = require('../controllers/services');
const reservation = require('../controllers/reservation');
const employee = require('../controllers/employee');
const branchOffice = require('../controllers/branchOffice');
const remainder = require('../controllers/remainder');
const auth = require('../controllers/auth');
const model = require('../controllers/model');
const brand = require('../controllers/brand');
const sell = require('../controllers/sell');
const paymentType = require('../controllers/PaymentType');
const factura = require('../controllers/factura');
const monedas = require('../controllers/monedas');

const category = require('../controllers/category');
const subcategory = require('../controllers/subcategory');

const controlStock = require('../controllers/controlStock');
const Email = require('../lib/Email')

module.exports = app => {
    router.get('/', home.index);

    router.get('/client', client.index);
    router.post('/client/add', client.create);
    router.post('/client/:client_id/update', client.update);
    router.delete('/client/:client_id/delete', client.remove);
    router.post('/client/:client_id/addvehicle', client.addVehicle);
    router.post('/client/:client_id/notifyArrival',client.notifyArrivalVehicle);

    router.get('/vehicle', vehicle.index);
    router.post('/vehicle/add', vehicle.create);
    router.post('/vehicle/:vehicle_id/update', vehicle.update);
    router.delete('/vehicle/:vehicle_id/delete', vehicle.remove);
    router.get('/vehicle/:vehicle_id', vehicle.getOne);
    router.get('/vehiclestock', vehicle.indexStock);
    router.post('/vehiclestock/add', vehicle.createStock);
    router.post('/vehiclestock/:vehicleStock_id/update', vehicle.updateStock);
    router.delete('/vehiclestock/:vehicleStock_id/delete', vehicle.removeStock);

    router.get('/dealer', dealer.index);
    router.post('/dealer/add', dealer.create);
    router.post('/dealer/:dealer_id/update', dealer.update);
    router.delete('/dealer/:dealer_id/delete', dealer.remove);
    router.get('/dealer/:dealer_id', dealer.getOne);

    router.get('/employee', employee.index);
    router.post('/employee/add', employee.create);
    router.post('/employee/:employee_id/update', employee.update);
    router.post('/employee/:employee_id/asignarSucursal', employee.asignarSucursal);
    router.delete('/employee/:employee_id/delete', employee.remove);
 
    router.get('/model', model.index);
    router.post('/model/add', model.create);
    router.post('/model/:model_id/update', model.update);
    router.delete('/model/:model_id/delete', model.remove);
 
    router.get('/brand', brand.index);
    router.post('/brand/add', brand.create);
    router.post('/brand/:brand_id/update', brand.update);
    router.delete('/brand/:brand_id/delete', brand.remove);

    
    router.get('/factura', factura.index);
    router.post('/factura/add', factura.create);
    router.post('/factura/:factura_id/update', factura.update);
    router.delete('/factura/:factura_id/delete', factura.remove);
    
    
    router.get('/monedas', monedas.index);
    router.post('/monedas/add', monedas.create);
    router.post('/monedas/:monedas_id/update', monedas.update);
    router.delete('/monedas/:monedas_id/delete', monedas.remove);
    
    router.get('/category', category.index);
    router.post('/category/add', category.create);
    router.post('/category/:category_id/update', category.update);
    router.delete('/category/:category_id/delete', category.remove);
    
    router.get('/subcategory', subcategory.index);
    router.post('/subcategory/add', subcategory.create);
    router.post('/subcategory/:subcategory_id/update', subcategory.update);
    router.delete('/subcategory/:subcategory_id/delete', subcategory.remove);

    router.get('/branchOffice', branchOffice.index);
    router.post('/branchOffice/add', branchOffice.create);
    router.post('/branchOffice/:branchOffice_id/update', branchOffice.update);
    router.delete('/branchOffice/:branchOffice_id/delete', branchOffice.remove);
    
    router.get('/productStock', productStock.index);
    router.post('/productStock/add', productStock.create);
    router.post('/productStock/:productStock_id/update', productStock.update);
    router.delete('/productStock/:productStock_id/delete', productStock.remove);

    
    router.get('/purchaseOrder', purchaseOrder.index);
    router.post('/purchaseOrder/add', purchaseOrder.create);
    router.post('/purchaseOrder/:purchaseOrder_id/update', purchaseOrder.update);
    router.delete('/purchaseOrder/:purchaseOrder_id/delete', purchaseOrder.remove);

    
    router.get('/purchaseOrderV', purchaseOrderV.index);
    router.post('/purchaseOrderV/add', purchaseOrderV.create);
    router.post('/purchaseOrderV/:purchaseOrderV_id/update', purchaseOrderV.update);
    router.delete('/purchaseOrderV/:purchaseOrderV_id/delete', purchaseOrderV.remove);
    router.post('/purchaseOrderV/:purchaseOrderV_id/setArrival', purchaseOrderV.setArrival);

    router.get('/product', product.index);
    router.post('/product/add', product.create);
    router.post('/product/:product_id/update', product.update);
    router.delete('/product/:product_id/delete', product.remove);
    router.post('/product/:product_id/actualizarPrecio', product.actualizarPrecioCompra);
    
    router.get('/service', service.index);
    router.post('/service/add', service.create);
    router.post('/service/:service_id/update', service.update);
    router.delete('/service/:service_id/delete', service.remove);
    
    router.get('/reservation', reservation.index);
    router.post('/reservation/add', reservation.create);
    router.post('/reservation/:reservation_id/update', reservation.update);
    router.delete('/reservation/:reservation_id/delete', reservation.remove);

    router.delete('/reservation/:reservation_id/cancel', reservation.cancel);
    router.post('/reservation/checkProduct', reservation.checkProduct);
    router.post('/reservation/reserveproduct', reservation.reserveProduct);
    router.post('/reservation/checkHour', reservation.checkHour);
    
    router.post('/reservation/prueba', reservation.pruebas);

    router.get('/remainder', remainder.index);
    router.post('/remainder/add', remainder.create);
    router.post('/remainder/:remainder_id/update', remainder.update);

    router.post('/signup', auth.signup);
    router.post('/login', auth.login);
    router.post('/changepassword', auth.changePassword);
    router.get('/getinfo', auth.getInfo);

    router.post('/sellVehicle/add', sell.sellVehicle);
    router.get('/sellVehicle', sell.listVehicle);

    router.post('/sellProduct/add', sell.sellProduct);
    router.get('/sellProduct',sell.listProduct);

    router.get('/paymentType', paymentType.index);
    router.post('/paymentType/add', paymentType.create);
    router.post('/paymentType/:paymentType_id/update', paymentType.update);
    router.delete('/paymentType/:paymentType_id/delete', paymentType.remove);
    
    router.get('/productControl', controlStock.indexCP);
    router.post('/productControl/:productControl_id/update', controlStock.updateCP);
    router.post('/productControl/:productControl_id/delete', controlStock.removeCP);
    router.post('/productControl/add', controlStock.createCP);
    
    router.get('/vehicleControl', controlStock.indexCV);
    router.post('/vehicleControl/:vehicleControl_id/update', controlStock.updateCV);
    router.post('/vehicleControl/:vehicleControl_id/delete', controlStock.removeCV);
    router.post('/vehicleControl/add', controlStock.createCV);
    

    app.use(router);
}