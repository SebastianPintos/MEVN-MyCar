const helperProduct = {};
const Product = require('../models/product');
const ProductStock = require('../models/productStock');
const Service = require("../models/service");
const Reservation = require('../models/reservation');
const helperStock = require('../lib/helperStock');

//Recibe un lista de servicios que a su vez contiene una lista de productos. La funcion checkea si hay existencia en el stock sufuciente para cubrir todos los productos
//Devuelve un lista con los productos que no tiene cantidad suficiente.
helperProduct.checkAvailable = async (service) => {

    console.log(service);
    //Recorro todos los servicios y agrego los ID de los productos al array products.
    var products = [];
    console.log(service.length);
    for (i = 0; i < service.length; i++) {
        var arrayProduct = service[i].Product;
        console.log("array productos" + service[i].Product);
        for (y = 0; y < arrayProduct.length; y++) {
            console.log("producto indivudual " + arrayProduct[y]);
            products.push(arrayProduct[y].toString());
        }
    }

    console.log(products);

    //Recorro la lista de productos, y creo una nueva lista donde los ID sean unicos (en el array product puede haber ID repetidos)
    var productSorted = [];
    for (i = 0; i < products.length; i++) {
        console.log("antes del if que mira si esta adentro del array " + productSorted.indexOf(products[i]));
        console.log(productSorted)
        console.log(products[i]);
        if (productSorted.indexOf(products[i]) === -1) {
            console.log('sorteador de productos' + productSorted);
            productSorted.push(products[i]);
        }
    }

    console.log(productSorted);

    //Creo un nuevo array donde tengo el ID del producto y la cantidad total de productos que necesito
    var count = 0;
    var arrayProductQuantity = [];
    for (i = 0; i < productSorted.length; i++) {
        for (y = 0; y < products.length; y++) {
            if (productSorted[i] === products[y]) {
                count += 1;
            }
        }
        var productQuantity = { id: productSorted[i], quantity: count };
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    console.log(arrayProductQuantity);

    //Checkeo si tengo la cantidad necesaria de los productos en el stock. Los productos que no tengo sufiente los guardo en un arreglo
    var productNotAvailable = [];
    var quantity = 0;
    for (i = 0; i < arrayProductQuantity.length; i++) {
        //busco los productos en la base de datos y cuanto la cantidad que tengo.
        console.log("antes de buscar en la base" + quantity);
        await ProductStock.find({ Product: arrayProductQuantity[i].id, Status: 'ACTIVE' }, (err, productsDB) => {
            if (err) { console.log(err) }
            else {
                console.log(productsDB);
                for (y = 0; y < productsDB.length; y++) {
                    quantity += productsDB[y].Available;
                }
                console.log("despues de buscar en la base " + quantity);
            }
        });

        if (arrayProductQuantity[i].quantity > quantity) {
            productNotAvailable.push(arrayProductQuantity[i].id);
        }
        quantity = 0;
        console.log("Aca deberia estar en cero " + quantity);
    }

    console.log(productNotAvailable);

    return productNotAvailable;

}

helperProduct.reserveProduct = async (service) => {
    console.log(service);
    //Recorro todos los servicios y agrego los ID de los productos al array products.
    var products = [];
    for (i = 0; i < service.length; i++) {
        var arrayProduct = service[i].Product;
        console.log("array productos" + service[i].Product);
        for (y = 0; y < arrayProduct.length; y++) {
            console.log("producto indivudual " + arrayProduct[y]);
            products.push(arrayProduct[y].toString());
        }
    }

    console.log(products);

    //Recorro la lista de productos, y creo una nueva lista donde los ID sean unicos (en el array product puede haber ID repetidos)
    var productSorted = [];
    for (i = 0; i < products.length; i++) {
        if (productSorted.indexOf(products[i]) === -1) {
            productSorted.push(products[i]);
        }
    }

    console.log(productSorted);

    //Creo un nuevo array donde tengo el ID del producto y la cantidad total de productos que necesito
    var count = 0;
    var arrayProductQuantity = [];
    for (i = 0; i < productSorted.length; i++) {
        for (y = 0; y < products.length; y++) {
            if (productSorted[i] === products[y]) {
                count += 1;
            }
        }
        var productQuantity = { id: productSorted[i], quantity: count };
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    console.log(arrayProductQuantity);

    for (i = 0; i < arrayProductQuantity.length; i++) {
        await ProductStock.find({ Product: arrayProductQuantity[i].id, Status: 'ACTIVE' }, async (err, productsDB) => {
            if (err) { console.log(err) }
            else {
                var quantity = 0;
                for (y = 0; y < productsDB.length; y++) {
                    if (arrayProductQuantity[i].quantity != 0) {
                        if (productsDB[y].Available >= arrayProductQuantity[i].quantity) {
                            productsDB[y].Available -= arrayProductQuantity[i].quantity;
                            productsDB[y].Reserved += arrayProductQuantity[i].quantity;
                            arrayProductQuantity[i].quantity = 0;
                        } else {
                            productsDB[y].Reserved += productsDB[y].Available;
                            arrayProductQuantity[i].quantity -= productsDB[y].Available;
                            productsDB[y].Available = 0;
                        }
                    }
                    
                    await productsDB[y].save((err) => {
                        if (err) { console.log(err) }
                    });

                    await helperStock.checkMin(productsDB[y]);

                }
            }
        });
    }
}

helperProduct.getServices = async (reservation) => {
    var services = [];
    for (i = 0; i < reservation.Service.length; i++) {
        await Service.findById(reservation.Service[i], (err, service) => {
            services.push(service);
        })
    }
    console.log(services);

    return services;
}

helperProduct.checkReservationTime = async (reservation) => {
    var startingHour = new Date(reservation.AppointmentTime);
    var duration = reservation.Duration;
    var finishingHour = new Date(startingHour.getTime() + duration * 60000);
    var dateStartDay = new Date(startingHour.getFullYear(), startingHour.getMonth(), startingHour.getDate());
    var dateFinishDay = new Date(startingHour.getFullYear(), startingHour.getMonth(), startingHour.getDate());
    dateStartDay.setHours(00, 00, 00);
    dateFinishDay.setHours(20, 00, 00);
    var occupied = 0;

    await Reservation.find({ AppointmentTime: { '$gte': dateStartDay, '$lte': dateFinishDay } }, (err, reserDB) => {
        if (err) { console.log(err) }
        else {
            for (i = 0; i < reserDB.length; i++) {
                var startingHourDB = new Date(reserDB[i].AppointmentTime);
                var finishingHourDB = new Date(startingHourDB.getTime() + reserDB[i].Duration * 60000);
                console.log('reserva ' + i);
                console.log(reserDB[i]);
                console.log('iniciodb ');
                console.log(startingHourDB);
                console.log('findb ');
                console.log(finishingHourDB);
                if (startingHour >= startingHourDB && startingHour < finishingHourDB) {
                    console.log('inicio entre');
                    occupied = 1;
                } else if (finishingHour > startingHourDB && finishingHour < finishingHourDB) {
                    console.log('fin entre');
                    occupied = 1;
                } else if (startingHour <= startingHourDB && finishingHour >= finishingHourDB) {
                    console.log('incluida');
                    occupied = 1;
                }
            }
        }
    })
    console.log('El lugar esta ' + occupied);

    return occupied;

}

helperProduct.CreateMail = (reservation, services) => {
    var body = '';

    body += '\n Datos de la reserva: \n';   
    body += 'Fecha y hora: ' + reservation.AppointmentTime + '\n';   
    body += 'Duracion Aproximada: ' + reservation.Duration + '\n';   
    body += 'Precio: ' + reservation.Price + '\n';   
    body += 'Duracion Aproximada: ' + reservation.Duration + '\n';   
    body += 'Dominio del vehiculo: ' + reservation.Domain + '\n'; 
    //datos de branchoffice faltan
    body += 'Servicios reservados: ' + '\n'; 

    for(i = 0; i < services.length; i++){
        body += '    ' + services[i].Description + '\n'; 
    };

    return body;

}

module.exports = helperProduct;