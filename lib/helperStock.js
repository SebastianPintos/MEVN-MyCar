const helperStock = {};
<<<<<<< HEAD
const product = require('../models/product');
const ProductControl = require('../models/productControl');
const ProductStock = require("../models/productStock");
const PurchaseOrder = require('../models/purchaseOrder')
=======
const ProductControl = require('../models/productControl');
const ProductStock = require("../models/productStock");
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998


//HABRIA QUE RECORRER TODOS LOS REPUESTOS Y COMPARAR CON LA CANTIDAD, POR SI HAY REPUESTOS IGUALES
//EN GENERAR ORDEN REEMPLAZAR POR PURCHASEORDER
/*En cada create/update de productStock recibe un productStock
Busca en los controles minimos si encuentra minimo para ese producto
Si encuentra un minimo y la cantidad de disponibles del producto es menor, genera orden de compra*/
helperStock.checkMin = async (repuesto) => {
<<<<<<< HEAD
    let productQuantity = 0;
    let product;

    await ProductStock.find({ Product: repuesto.Product, Status: 'ACTIVE' }, (err, products) => {
        if (err) { console.log(err) }
        else {
            console.log(products);
            product = products[0];
            for (y = 0; y < products.length; y++) {
                productQuantity += products[y].Available;
            }
        }
    }).populate('Product');

    console.log('despues de buscar los productos', product);
    console.log('cantidad disponible ', productQuantity);


    await ProductControl.find(async (err, productControl) => {
        console.log(productControl);
        for (let i = 0; i < productControl.length; i++) {
            console.log('producto recibido ', repuesto.Product);
            console.log('producto controll ', productControl[i].Product);
            console.log('cantidad disponible ', productQuantity);
            console.log('min  ', productControl[i].Min);

            if (repuesto.Product.toString() === productControl[i].Product.toString() && productQuantity < productControl[i].Min) {
                console.log("GENERAR ORDEN");
                let countPO = 0;
                await PurchaseOrder.estimatedDocumentCount((err, count) => {
                    if (err) { console.log(err) }
                    else { countPO = count + 1}
                });

                let purchaseOrder = new PurchaseOrder({
                    OrderDate: new Date(),
                    Price: product.Product.SalePrice,
                    Code: countPO,
                    Product: [{
                        ProductID: product._id,
                        BatchNum: product.BatchNum,
                        Expiration: product.Expiration,
                        TotalOrder: '1',
                        Price: product.Product.SalePrice
                    }],
                    Dealer: product.Product.Dealer,
                    BranchOffice: product.BranchOffice,
                    Status: 'ACTIVE',
                    Type: 'ENVIADA'
                })
                console.log(purchaseOrder);

                purchaseOrder.save((err) => {
                    if (err) { console.log(err) }
                    else { console.log('guardo bien') };
                });
            }
        }
    });
=======
   await ProductControl.find((err, productControl) => {   
    for(let i=0; i< productControl.length; i++){
           if(repuesto.Product == productControl[i].Product && repuesto.Available< productControl[i].Min){
               console.log("GENERAR ORDEN");
           }
       }
   });
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
}

/*En la creación de un stock mínimo de repuestos, chequea que la cantidad de repuestos
No sea menor al mínimo. Para ello, recorre productStock y si coincide el id compara
la cantidad de disponibles con el min. Si Min< Available genera orden de compra
Si no encontró ningun productStock que coincida para comparar, significa que no hay ninguno 
en stock. Por lo tanto, debe generar orden de compra*/
helperStock.checkMinCreation = async (controlStock) => {
<<<<<<< HEAD
    await ProductStock.find({ Product: controlStock.Product, Status: 'ACTIVE' }, async (err, productStock) => {

        let productQuantity = 0;
        console.log('producto de la base', productStock);
        for (y = 0; y < productStock.length; y++) {
            productQuantity += productStock[y].Available;
        }

        console.log('cantidad disponible', productQuantity);
        console.log('min ', controlStock.Min);


        if (productQuantity < controlStock.Min) {
            console.log("GENERAR ORDEN");
            let countPO = 0;
            await PurchaseOrder.estimatedDocumentCount((err, count) => {
                if (err) { console.log(err) }
                else { countPO = count + 1}
            });
            
            console.log('product ', productStock[0]);
            console.log('product ', productStock[0].Product);
            console.log('sale price  ', productStock[0].Product.SalePrice);

            

            let purchaseOrder = new PurchaseOrder({
                OrderDate: new Date(),
                Code: countPO,
                Product: [{
                    ProductID: productStock[0]._id,
                    BatchNum: productStock[0].BatchNum,
                    Expiration: productStock[0].Expiration,
                    TotalOrder: '1',
                    Price: productStock[0].Product.SalePrice
                }],
                Price: productStock[0].Product.SalePrice,
                Dealer: productStock[0].Product.Dealer,
                BranchOffice: productStock[0].BranchOffice,
                Status: 'ACTIVE',
                Type: 'ENVIADA'
            })
            console.log(purchaseOrder);

            await purchaseOrder.save((err) => {
                if (err) { console.log(err) }
                else { console.log('guardo bien') };
            });
        }
    }).populate('Product');
}
module.exports = helperStock; 
=======
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
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
