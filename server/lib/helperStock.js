const helperStock = {};
const ProductControl = require('../models/productControl');
const ProductStock = require("../models/productStock");


//HABRIA QUE RECORRER TODOS LOS REPUESTOS Y COMPARAR CON LA CANTIDAD, POR SI HAY REPUESTOS IGUALES
//EN GENERAR ORDEN REEMPLAZAR POR PURCHASEORDER
/*En cada create/update de productStock recibe un productStock
Busca en los controles minimos si encuentra minimo para ese producto
Si encuentra un minimo y la cantidad de disponibles del producto es menor, genera orden de compra*/
helperStock.checkMin = async (repuesto) => {
   await ProductControl.find((err, productControl) => {   
    for(let i=0; i< productControl.length; i++){
           if(repuesto.Product == productControl[i].Product && repuesto.Available< productControl[i].Min){
               console.log("GENERAR ORDEN");
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
    await ProductStock.find((err, productStock) => {   
     for(let i=0; i< productStock.length; i++){
            if(productStock[i].Product == controlStock.Product && productStock[i].Available< controlStock.Min){
                console.log("GENERAR ORDEN");
                return;
            }
        }
        console.log("GENERAR ORDEN");
    });
 }
module.exports = helperStock;