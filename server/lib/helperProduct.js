const helperProduct = {};
const Product = require('../models/product');
const ProductStock = require('../models/productStock');

//Recibe un lista de servicios que a su vez contiene una lista de productos. La funcion checkea si hay existencia en el stock sufuciente para cubrir todos los productos
//Devuelve un lista con los productos que no tiene cantidad suficiente, si hay cantidad suficiente, devuelve 0.
helperProduct.checkAvailable = (service) => {
    
    //Recorro todos los servicios y agrego los ID de los productos al array products.
    var products = [];
    for(item in service){
        for(product in item){
            products.push(product._id);
        }
    }

    //Recorro la lista de productos, y creo una nueva lista donde los ID sean unicos (en el array product puede haber ID repetidos)
    var productSorted = [];
    var productQuantity = {productID, available};
    for(item in products){
        if(productSorted.indexOf(item) === -1){
            productSorted.push(item);
        } 
    }

    //Creo un nuevo array donde tengo el ID del producto y la cantidad total de productos que necesito
    var count = 0;
    var arrayProductQuantity = [];
    for (product in productSorted){
        for(item in products){
            if(product === item){
                count += 1;
            }
        }
        var productQuantity = {id: product, quantity: count};
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    //Checkeo si tengo la cantidad necesaria de los productos en el stock. Los productos que no tengo sufiente los guardo en un arreglo
    var productNotAvailable = [];
    for(productQuantity in arrayProductQuantity){
        //busco los productos en la base de datos y cuanto la cantidad que tengo.
        ProductStock.find({Product: productQuantity.id, Status:'AVAILABLE'}, (err, productsDB) => {
            if(err){console.log(err)}
            else {
                var quantity = 0;
                for(product in productsDB){
                    quantity += product.Available;
                }
            }
        });

        if (productQuantity.quantity > quantity){
            productNotAvailable.push(productQuantity.id);
        }
    }
    
    if(productNotAvailable){
        return productNotAvailable;
    }else{
        return 0;
    }
}

helperProduct.reserveProduct = (service) => {
    //Recorro todos los servicios y agrego los ID de los productos al array products.
    var products = [];
    for(item in service){
        for(product in item){
            products.push(product._id);
        }
    }

    //Recorro la lista de productos, y creo una nueva lista donde los ID sean unicos (en el array product puede haber ID repetidos)
    var productSorted = [];
    var productQuantity = {productID, available};
    for(item in products){
        if(productSorted.indexOf(item) === -1){
            productSorted.push(item);
        } 
    }

    //Creo un nuevo array donde tengo el ID del producto y la cantidad total de productos que necesito
    var count = 0;
    var arrayProductQuantity = [];
    for (product in productSorted){
        for(item in products){
            if(product === item){
                count += 1;
            }
        }
        var productQuantity = {id: product, quantity: count};
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    
}

module.exports = helperProduct;