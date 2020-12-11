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
   let product;

   await ProductStock.find({Product: repuesto.Product, Status: 'ACTIVE'}, (err, products) => {
       if(err) {console.log(err)}
       else{
           console.log(products);
           product = products[0];
           for(y = 0; y < products.length; y++){
                productQuantity += products[y].Available;
           }
       }
    }).populate('Product');

    console.log('despues de buscar los productos', product);
    console.log('cantidad disponible ', productQuantity);
    
   
    await ProductControl.find(async (err, productControl) => {   
        console.log(productControl);
        for(let i=0; i< productControl.length; i++){
        console.log('producto recibido ', repuesto.Product);
        console.log('producto controll ', productControl[i].Product);
        console.log('cantidad disponible ', productQuantity);
        console.log('min  ', productControl[i].Min);

           if(repuesto.Product.toString() === productControl[i].Product.toString() && productQuantity < productControl[i].Min){
               console.log("GENERAR ORDEN");
               let purchaseOrder =  new PurchaseOrder({
                   OrderDate: new Date(),
                   Price: product.Product.SalePrice,
                   Product:[{
                       ProductID: product._id,
                       BatchNum: product.BatchNum,
                       Expiration: product.Expiration,
                       TotalOrder: '1',
                       Price: product.Product.SalePrice
                   }],
                   Dealer: product.Product.Dealer,
                   BranchOffice: product.BranchOffice,
                   Status: 'ACTIVE'
               })
               console.log(purchaseOrder);

               purchaseOrder.save((err) => {
                if (err) { console.log(err) }
                else {console.log('guardo bien')};
            });
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
            productQuantity +=  products[y].Available;
       }
     
        if(productQuantity < controlStock.Min){
            console.log("GENERAR ORDEN");
            return;
        }
        console.log("GENERAR ORDEN");
    });
 }
module.exports = helperStock; 