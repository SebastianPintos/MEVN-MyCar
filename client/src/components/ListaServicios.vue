<template>
<div>
    <v-data-table v-if="tabla" v-model="selected" :single-select="singleSelect" :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_id" class="elevation-1">
        <template v-slot:[`item.actions`]="{ item }">

            <v-btn v-if="item.carrito == false" fab small color="success">
                <v-icon class="text-center" @click="agregarAlCarrito(item)">
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-if="item.carrito" fab small color="error">
                <v-icon class="text-center" @click="eliminarDelCarrito(item)">
                    mdi-cart-remove</v-icon>
            </v-btn>

        </template>

        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
                <v-flex class="text-right">
                    <v-btn right color="warning" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarCarrito()">
                        <v-icon>
                            mdi-cart-outline
                        </v-icon>
                    </v-btn>
                </v-flex>
            </v-toolbar>
        </template>

        <template v-slot:no-data>
            <v-btn color="primary" @click="elegirCliente = true">
                Volver
            </v-btn>
        </template>
    </v-data-table>

    <v-dialog v-model="dialogCarrito" max-width="400px">
        <v-card>
            <v-card-title>
                <h2>Dettalle del Carrito</h2>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <ol v-if="carritoCompleto!= null">
                        <li v-for="(servicio,index) in carritoCompleto.serviciosCarrito" :key="index">
                            <h3>Servicio:</h3>
                            <p>Descripción: {{servicio.Description}}</p>
                            <p>Precio Mano de Obra: ${{servicio.LaborPrice}}</p>
                            <p>Tiempo estimado en Minutos: {{servicio.Time}}</p>
                            <ol>
                                <h3 v-if="servicio.Product!=null & servicio.Product.length>0">Repuestos Asociados</h3>
                                <li v-for="(repuesto, j) in servicio.Product" :key="j">
                                    <p>Código del Producto: {{repuesto.Code}}</p>
                                    <p>Precio del Producto: ${{repuesto.Price}}</p>
                                </li>
                            </ol>
                        </li>
                    </ol>
                    <h3>Tiempo Estimado Total:</h3>
                    <p>{{defaultCarritoCompleto.tiempoTotal}}</p>
                    <h3>Subtotal Mano de Obra:</h3>
                    <p>${{carritoCompleto.totalManoDeObra}}</p>
                    <h3>Subtotal Repuestos:</h3>
                    <p>${{carritoCompleto.totalRepuestos}}</p>
                    <h3>Total:</h3>
                    <p>${{carritoCompleto.total}}</p>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="deleteCarritoConfirm=true">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" @click="dialogCarrito=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" @click="corroborarService">
                        <v-icon>mdi-calendar</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-card v-if="elegirCliente">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title>Vehículo y Sucursal
            </v-card-title>
            <v-card-text>
                <v-select label="Sucursal" v-model="filtros.BranchOffice" :items="sucursales" item-text="Name" item-value="Name" :rules="requerido"></v-select>
                <v-select label="ID del cliente" v-model="cliente" :items="clientes" item-text="DNI" item-value="_id" @change="client=>cambiarVehiculo(client)" :rules="requerido"></v-select>
                <v-select v-model="vehiculo" label="Dominio del Vehículo" :items="vehicles" item-text="Domain" item-value="VehicleID" :rules="requerido">
                </v-select>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn block class="success mb-2" @click="validarDatos">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn block class="warning" :to="'/clientes'">¿Cliente o Vehículo no Registrado?</v-btn>
                </v-flex>
            </v-card-actions>
        </v-form>
    </v-card>
    <v-dialog v-model="dialogCalendario" max-width="130px">
        <v-card>
            <v-card-text></v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="error mb-2" @click="dialogCalendario=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn :to="'/calendario'" class="info warning mb-2">
                        <v-icon>mdi-calendar</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteCarritoConfirm" max-width="300px">
        <v-card>
            <v-card-title>
                <h3>Confirmación</h3>
            </v-card-title>
            <v-card-text>
                <p>Está seguro de que desea eliminar el carrito? (Esta acción será irreversible!)
                </p>
            </v-card-text>
            <v-card-actions>
                <v-btn class="info mb-2" @click="deleteCarritoConfirm=false">
                    <v-icon>mdi-cancel</v-icon>
                </v-btn>
                <v-btn class="info mb-2" @click="descartarCarrito">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
    <v-snackbar v-model="snackbar">
        {{ mensaje }}

        <template v-slot:action="{ attrs }">
            <v-btn class="info" v-bind="attrs" @click="snackbar = false">
                <v-icon>mdi-check</v-icon>
            </v-btn>

        </template>
    </v-snackbar>

</div>
</template>

<script>
import axios from "axios";

export default {

    data: () => ({
        cliente: {},
        tabla: false,
        aceptado: false,
        dialogCalendario: false,
        valid: true,
        deleteCarritoConfirm: false,
        filtros: [{
            BranchOffice: '',
            Model: '',
            Brand: '',
            year: '',
        }],
        servicioEnCarrito: {
            Description: "",
            Time: "",
            LaborPrice: "",
            Product: [],
        },
        carritoCompleto: {
            serviciosCarrito: [],
            totalManoDeObra: "",
            totalRepuestos: "",
            tiempoTotal: "",
            total: "",
            ids: [],
        },
        elegirCliente: true,
        serviciosCarrito: [],
        selected: [],
        singleSelect: true,
        search: '',
        on: '',
        attrs: '',
        snackbar: false,
        mensaje: '',
        dialogCarrito: false,
        vehicle: {},

        editedItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
            carrito: false,
        },

        defaultItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
            carrito: false,
        },

        requerido: [
            value => !!value || 'Requerido.',
        ],

        defaultCarritoCompleto: [],
        vehicles: [],
        allVehicles: [],
        vehiculo: null,
        headers: [{
                text: 'Nombre',
                value: 'Description',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Precio',
                value: 'LaborPrice',
            },
            {
                text: 'Sucursal',
                value: 'BranchOffice.Name',
            },
            {
                text: 'Duración',
                value: 'Time',
            },
            {
                text: 'Marca-Vehículo',
                value: 'Vehicle.Brand'
            },
            {
                text: 'Modelo-Vehículo',
                value: 'Vehicle.Model'
            },
            {
                text: 'Año-Vehículo',
                value: 'Vehicle.year'
            },

            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],

        servicios: [],
        serviciosFiltrados: [],
        sucursales: [],
        clientes: [],
    }),
    created() {
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getServicios();
            this.getSucursales();
            this.getClientes();
            this.getVehiculo();
            this.obtenerDeLocalStorage();
        },

        async getServicios() {
            let servicios = [];
            let servicioAGuardar = {};
            let cont = 0;
            await axios.get('http://localhost:8081/service')
                .then(res => {
                    servicios = res.data.service.filter(aService => aService.Status === "ACTIVE");
                    if (servicios != null) {
                        for (let i = 0; i < servicios.length; i++) {
                            if (servicios[i].BranchOffice.length > 0) {
                                servicios[i].BranchOffice.forEach(sucursal => {
                                    let item = JSON.parse(localStorage.getItem(String(i)));
                                    let carrito = false;
                                    if (item != null) {
                                        if (item._id == servicios[i]._id + sucursal._id) {
                                            carrito = item.carrito;
                                        }
                                    }
                                    servicioAGuardar = {
                                        "_id": servicios[i]._id + sucursal._id,
                                        "Description": servicios[i].Description,
                                        "LaborPrice": servicios[i].LaborPrice,
                                        "Time": servicios[i].Time,
                                        "Vehicle": servicios[i].Vehicle,
                                        "BranchOffice": sucursal,
                                        "Product": servicios[i].Product,
                                        "carrito": carrito,
                                    };
                                    localStorage.setItem(String(cont), JSON.stringify(servicioAGuardar));
                                    cont++;
                                })

                            }
                        }
                    }
                })
            localStorage.setItem("length", cont);
        },

        async getSucursales() {
            await axios.get('http://localhost:8081/branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });
        },

        async getClientes() {
            await axios.get('http://localhost:8081/client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },

        async getVehiculo() {
            await axios.get('http://localhost:8081/vehicle')
                .then(res => {
                    this.allVehicles = res.data.vehicle;
                });
        },

        obtenerDeLocalStorage() {
            let length = parseInt(JSON.parse(localStorage.getItem("length")));
            length++;
            for (let i = 0; i < length; i++) {
                let servicio = JSON.parse(localStorage.getItem(String(i)));
                if (servicio != null) {
                    this.servicios.push(servicio);
                }
            }
            this.serviciosFiltrados = this.servicios;
        },

        agregarAlCarrito(item) {
            let seleccionado = this.servicios.indexOf(item);
            if (seleccionado != -1) {
                this.servicios[seleccionado].carrito = true;
                let item = JSON.parse(localStorage.getItem(String(seleccionado)));
                if (item != null) {
                    item.carrito = true;
                    localStorage.setItem(String(seleccionado), JSON.stringify(item));
                }
            }
        },
        eliminarDelCarrito(item) {
            let seleccionado = this.servicios.indexOf(item);
            if (seleccionado != -1) {
                this.servicios[seleccionado].carrito = false;
                let item = JSON.parse(localStorage.getItem(String(seleccionado)));
                if (item != null) {
                    item.carrito = false;
                    localStorage.setItem(String(seleccionado), JSON.stringify(item));
                }
            }
        },
        calcularCarrito() {
            let detalleCarrito = [];
            let ids = [];
            let sumaTrabajo = 0;
            let sumaProductos = 0;
            let sumaTiempo = 0;
            this.carritoCompleto = this.defaultCarritoCompleto;
            if (this.serviciosFiltrados.length > 0) {
                this.serviciosFiltrados.forEach(servicio => {
                    if (servicio.carrito) {
                        this.servicioEnCarrito.Description = servicio.Description;
                        this.servicioEnCarrito.Time = servicio.Time;
                        this.servicioEnCarrito.LaborPrice = servicio.LaborPrice;
                        sumaTiempo += servicio.Time;
                        sumaTrabajo += servicio.LaborPrice;
                        ids.push(this.servicios.indexOf(servicio));
                        if (servicio.Product != null & servicio.Product.length > 0) {
                            servicio.Product.forEach(product => {
                                if (product.SalePrice != undefined) {
                                    sumaProductos += product.SalePrice;
                                    this.servicioEnCarrito.Product.push({
                                        'Code': product.Code,
                                        'Price': product.SalePrice
                                    });
                                }
                            })
                        }
                        let servicioEnCarrito = {
                            ids: [],
                            Description: "",
                            Time: "",
                            LaborPrice: "",
                            Product: [],
                        };
                        servicioEnCarrito.Description = this.servicioEnCarrito.Description;
                        servicioEnCarrito.Time = this.servicioEnCarrito.Time;
                        servicioEnCarrito.LaborPrice = this.servicioEnCarrito.LaborPrice;
                        servicioEnCarrito.Product = this.servicioEnCarrito.Product;
                        detalleCarrito.push(servicioEnCarrito);
                    }
                });
                this.carritoCompleto = this.defaultCarritoCompleto;
                this.carritoCompleto.ids = ids;
                this.carritoCompleto.serviciosCarrito = detalleCarrito;
                this.carritoCompleto.totalRepuestos = sumaProductos;
                this.carritoCompleto.totalManoDeObra = sumaTrabajo;
                this.carritoCompleto.total = sumaTrabajo + sumaProductos;
                this.carritoCompleto.tiempoTotal = this.timeConvert(sumaTiempo);

                localStorage.removeItem("carrito");
                localStorage.setItem("carrito", JSON.stringify({
                        "ids": this.carritoCompleto.ids,
                        "serviciosCarrito": this.carritoCompleto.serviciosCarrito,
                        "totalRepuestos": this.carritoCompleto.totalRepuestos,
                        "totalManoDeObra": this.carritoCompleto.totalManoDeObra,
                        "total": this.carritoCompleto.total,
                        "tiempoTotal": this.carritoCompleto.tiempoTotal
                    }));

                }
            },

            mostrarCarrito() {
                    this.calcularCarrito();
                    this.dialogCarrito = true;
                },

                timeConvert(n) {
                    var minutes = n % 60
                    var hours = (n - minutes) / 60
                    return ("" + hours + " horas, " + minutes + " minutos");
                },

                aplicarFiltros(marca, modelo, año) {
                    marca = marca == null ? "" : marca;
                    modelo = modelo == null ? "" : modelo;
                    año = año == null ? "" : año;
                    console.log("Marca " + JSON.stringify(marca) + " modelo: " + JSON.stringify(modelo) + " año " + JSON.stringify(año));

                    if (!marca && !modelo && !año && !this.filtros.BranchOffice) {
                        return
                    }

                    let filtrados = this.servicios.filter(servicio => servicio.BranchOffice.Name == this.filtros.BranchOffice);
                    filtrados.forEach(servicio => {
                        if (servicio.Vehicle == null) {
                            this.serviciosFiltrados.push(servicio);
                        } else {
                            let añoServicio = servicio.Vehicle.year == null ? "" : servicio.Vehicle.year;
                            let modeloServicio = servicio.Vehicle.Model == null ? "" : servicio.Vehicle.Model;
                            let marcaServicio = servicio.Vehicle.Brand == null ? "" : servicio.Vehicle.Brand;
                            if (añoServicio == año && modeloServicio == modelo && marcaServicio == marca) {
                                this.serviciosFiltrados.push(servicio);
                            }
                        }
                    })
                },

                reiniciarFiltros() {
                    this.filtros = [{
                        BranchOffice: '',
                        Brand: '',
                        Model: '',
                        year: '',
                    }]
                    this.serviciosFiltrados = this.servicios
                },

                descartarCarrito() {
                    this.carritoCompleto = this.defaultCarritoCompleto;
                    this.deleteCarritoConfirm = false;
                    this.dialogCarrito = false;
                    for (let i = 0; i < this.servicios.length; i++) {
                        this.servicios[i].carrito = false;
                        let item = JSON.parse(localStorage.getItem(String(i)));
                        if (item != null) {
                            item.carrito = false;
                            localStorage.setItem(String(i), JSON.stringify(item));
                        }
                    }
                },

                aceptarCarrito() {
                    this.elegirCliente = true;
                },

                cambiarVehiculo(client) {
                    this.clientes.forEach(cliente => {
                        if (cliente._id == client) {
                            cliente.Vehicle.forEach(vehiculo => {
                                this.vehicles.push(vehiculo);
                            })
                        }
                    });
                },

                obtenerVehiculo() {
                    axios.get('http://localhost:8081/vehicle/' + this.vehiculo)
                        .then(res => {
                            this.vehicle = res.data.vehicle;
                            this.filtros.Model = this.vehicle.Model;
                            this.filtros.Brand = this.vehicle.Brand;
                            this.filtros.year = this.vehicle.year;
                            localStorage.setItem("cliente", JSON.stringify({
                                "cliente": this.cliente,
                                "vehiculo": this.vehicle,
                            }));
                            let sucursal = this.sucursales.filter(sucursal => sucursal.Name == this.filtros.BranchOffice);
                            if (sucursal != null) {
                                localStorage.removeItem("sucursal");
                                localStorage.setItem("sucursal", JSON.stringify(sucursal[0]));
                            }
                            this.serviciosFiltrados = [];
                            this.aplicarFiltros(res.data.vehicle.Brand, res.data.vehicle.Model, res.data.vehicle.year);
                        });

                },

                guardarCliente() {
                    this.obtenerVehiculo();
                    //  this.aplicarFiltros();
                },

                validarDatos() {
                    if (this.$refs.form.validate()) {
                        this.obtenerVehiculo();

                        //this.aplicarFiltros();
                        this.elegirCliente = false;
                        this.tabla = true;
                    }
                },

                corroborarService() {
                    console.log("corroborando stock");
                    location.href = "/turno";
                },

        }
    };
</script>

<style>

</style>
