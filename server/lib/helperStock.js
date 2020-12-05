const helperStock = {};
const product = require('../models/product');
const ProductControl = require('../models/productControl');
const ProductStock = require("../models/productStock");
const PurchaseOrder = require('../models/purchaseOrder')


//HABRIA QUE RECORRER TODOS LOS REPUESTOS Y COMPARAR CON LA CANTIDAD, POR SI HAY REPUESTOS IGUALES
//EN GENERAR ORDEN REEMPLAZAR POR PURCHASEORDER
/*En cada create/update de productStock recibe un productStock
Busca en los controles minimos si encuentra minimo para ese producto
Si encuentra un minimo y la cantidad de disponibles del producto es menor, genera orden de compra*/
helperStock.checkMin = async (repuesto) => {
   let productQuantity = 0;

   await ProductStock.find({Product: repuesto.Product, Status: 'ACTIVE'}, (err, products) => {
       if(err) {console.log(err)}
       else{
           for(y = 0; y < products.length; y++){
                productQuantity += products[y].Available;
           }
       }
    });
   
    await ProductControl.find(async (err, productControl) => {   
    for(let i=0; i< productControl.length; i++){
           if(repuesto.Product == productControl[i].Product && productQuantity < productControl[i].Min){
               console.log("GENERAR ORDEN");
               /* let purchaseOrder =  PurchaseOrder({
                   OrderDate: new Date(),
                   //Price:
                   Product:[]
               }) */
           }
       }
   });
}

/*En la creación de un stock mínimo de repuestos, chequea que la cantidad de repuestos
No sea menor al mínimo. Para ello, recorre productStock y si coincide el id compara
la cantidad de disponibles con el min. Si Min< Available genera orden de compra
Si no encontró ningun productStock que coincida para comparar, significa que no hay ninguno 
en stock. Por lo tanto, debe generar orden de compra*/
helperStock.checkMinCreation = async (controlStock) => {
    await ProductStock.find({Product: controlStock.Product, Status: 'ACTIVE'},(err, productStock) => {   
        
        let productQuantity = 0;
        for(y = 0; y < productStock.length; y++){
            productQuantity += products[y].Available;
       }
     
        if(productQuantity < controlStock.Min){
            console.log("GENERAR ORDEN");
            return;
        }
        console.log("GENERAR ORDEN");
    });
 }
module.exports = helperStock; 