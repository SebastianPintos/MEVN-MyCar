<template>
<div>
    <v-data-table v-if="tabla" v-model="selected" :single-select="singleSelect" :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_idTabla" class="elevation-1">
         <template v-slot:item.LaborPrice="{ item }">
                {{ formatPrice(item.LaborPrice) }}
         </template>
        
        <template v-slot:[`item.actions`]="{ item }">

            <v-btn v-if="item.carrito == false" fab small color="success" @click="agregarAlCarrito(item)">
                <v-icon class="text-center" >
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-if="item.carrito" fab small color="error"  @click="eliminarDelCarrito(item)">
                <v-icon class="text-center">
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
            <v-btn color="primary" @click="tabla=false; elegirCliente = true;">
                Volver
            </v-btn>
        </template>
    </v-data-table>

    <v-dialog v-model="dialogCarrito" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <h2>Detalle del Carrito</h2>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <ol v-if="carritoCompleto!= null">
                        <li v-for="(servicio,index) in carritoCompleto.serviciosCarrito" :key="index">
                            <h3>Servicio: </h3>
                            <v-text-field readonly :value="servicio.Description"></v-text-field>
                                        <v-text-field readonly :value="'Precio Mano de Obra: $'+servicio.LaborPrice"></v-text-field>
                                        <v-text-field readonly :value="'Duración Estimada: '+servicio.Time"></v-text-field>
                            
                            <ol>
                                <h3 v-if="servicio.Product!=null & servicio.Product.length>0">Repuestos Asociados:</h3>
                                <li v-for="(repuesto, j) in servicio.Product" :key="j">
                                    <v-text-field readonly :value="'Marca: '+repuesto.Brand"></v-text-field>
                                      <v-text-field readonly :value="'Categoría: '+repuesto.Category"></v-text-field>
                                       
                                        <div v-if="repuesto.SubCategory!=null">
                                                <v-text-field readonly :value="'Sub-Categoría: '+repuesto.SubCategory"></v-text-field>
                                        </div>
                                      <v-text-field readonly :value="'SKU: '+repuesto.SKU"></v-text-field>
                                    <v-text-field readonly :value="'Precio: $'+repuesto.Price"></v-text-field>

                                </li>
                            </ol>
                        </li>
                    </ol>
                          <v-text-field readonly :value="'Tiempo Estimado Total: '+defaultCarritoCompleto.tiempoTotalString"></v-text-field>
                        <v-text-field readonly :value="'Subtotal Mano de Obra: $'+carritoCompleto.totalManoDeObra"></v-text-field>
                        <v-text-field readonly :value="'Subtotal Repuestos: $'+carritoCompleto.totalRepuestos"></v-text-field>
                     
                                <v-text-field readonly :value="'Total: $'+carritoCompleto.total"></v-text-field>
                         

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
                <v-select v-model="filtros.Client" label="ID del Cliente" :items="clientes" item-text="DNI" item-value="_id" :rules="requerido" @change="client=>cambiarVehiculo(client)">
                    <template slot="item" slot-scope="data">
                        {{ data.item.DNI }} - {{ data.item.Name }} {{ data.item.LastName }}
                    </template>
                </v-select>
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

    <v-dialog v-model="deleteCarritoConfirm" persistent max-width="300px">
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
import urlAPI from "../config/config.js"

export default {

    data: () => ({
        Domain: "",
        cliente: {},
        tabla: false,
        aceptado: false,
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
            tiempoTotalString: "",
            total: "",
            ids: [],
            idsServ: [],
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
                text: 'Tipo',
                value: 'Type',
            },
            {
                text: 'Precio',
                value: 'LaborPrice',
                align: 'right'
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
        },

        async getServicios() {
            let servicios = [];
            let servicioAGuardar = {};
            //   let cont = 0;
            await axios.get(urlAPI + 'service')
                .then(res => {
                    servicios = res.data.service.filter(aService => aService.Status === "ACTIVE");
                    servicios.forEach(servicio => {
                        servicio.BranchOffice.forEach(sucursal => {
                            servicioAGuardar = {
                                "_id": servicio._id,
                                "_idTabla": servicio._id + sucursal._id,
                                "Description": servicio.Description,
                                "LaborPrice": servicio.LaborPrice,
                                "Time": servicio.Time,
                                "Vehicle": servicio.Vehicle,
                                "BranchOffice": sucursal,
                                "Product": servicio.Product,
                                "carrito": false,
                            };
                            this.servicios.push(servicioAGuardar);
                            this.serviciosFiltrados.push(servicioAGuardar);
                        });
                    });
                });
        },

        async getSucursales() {
            await axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });
        },

        async getClientes() {
            await axios.get(urlAPI + 'client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },

        async getVehiculo() {
            await axios.get(urlAPI + 'vehicle')
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
            }
        },
        eliminarDelCarrito(item) {
            let seleccionado = this.servicios.indexOf(item);
            if (seleccionado != -1) {
                this.servicios[seleccionado].carrito = false;
            }
        },
        calcularCarrito() {
            let detalleCarrito = [];
            let ids = [];
            let idsServ = [];
            let sumaTrabajo = 0;
            let sumaProductos = 0;
            let sumaTiempo = 0;
            this.carritoCompleto = this.defaultCarritoCompleto;
            if (this.serviciosFiltrados.length > 0) {
                this.serviciosFiltrados.forEach(servicio => {
                    if (servicio.carrito == true) {
                        this.servicioEnCarrito.Description = servicio.Description;
                        this.servicioEnCarrito.Time = servicio.Time;
                        this.servicioEnCarrito.LaborPrice = servicio.LaborPrice;
                        sumaTiempo += servicio.Time;
                        sumaTrabajo += servicio.LaborPrice;
                        ids.push(this.servicios.indexOf(servicio));
                        idsServ.push(servicio._id);
                        if (servicio.Product != null & servicio.Product.length > 0) {
                            servicio.Product.forEach(product => {
                                if (product.SalePrice != undefined) {
                                    sumaProductos += product.SalePrice;
                                    this.servicioEnCarrito.Product.push({
                                        'Brand': product.Brand,
                                        'Category': product.Category,
                                        'SubCategory': product.SubCategory,
                                        'SKU': product.SKU,
                                        'Price': product.SalePrice
                                    });
                                }
                            })
                        }
                        let servicioEnCarrito = {
                            Description: "",
                            Time: "",
                            LaborPrice: "",
                            Product: [],
                        };
                        servicioEnCarrito.Description = this.servicioEnCarrito.Description;
                        servicioEnCarrito.Time = this.timeConvert(this.servicioEnCarrito.Time);
                        servicioEnCarrito.LaborPrice = this.servicioEnCarrito.LaborPrice;
                        servicioEnCarrito.Product = this.servicioEnCarrito.Product;
                        servicioEnCarrito.ids = ids;
                        detalleCarrito.push(servicioEnCarrito);
                    }
                });
                this.carritoCompleto = this.defaultCarritoCompleto;
                this.carritoCompleto.ids = ids;
                this.carritoCompleto.serviciosCarrito = detalleCarrito;
                this.carritoCompleto.totalRepuestos = sumaProductos;
                this.carritoCompleto.totalManoDeObra = sumaTrabajo;
                this.carritoCompleto.total = sumaTrabajo + sumaProductos;
                this.carritoCompleto.tiempoTotal = sumaTiempo;
                this.carritoCompleto.tiempoTotalString = this.timeConvert(sumaTiempo);
                this.carritoCompleto.idsServ = idsServ;
                localStorage.removeItem("carrito");
                localStorage.setItem("carrito", JSON.stringify({
                    "ids": ids,
                    "idsServ": idsServ,
                    "serviciosCarrito": detalleCarrito,
                    "totalRepuestos": sumaProductos,
                    "totalManoDeObra": sumaTrabajo,
                    "total": this.carritoCompleto.total,
                    "tiempoTotal": this.carritoCompleto.tiempoTotal,
                    "tiempoTotalString": this.carritoCompleto.tiempoTotalString
                }));

            }
        },

        mostrarCarrito() {
            this.calcularCarrito();
            this.dialogCarrito = true;
        },
        timeConvert(time) {
            if (time != null) {
                var min = time % 60;
                var hs = (time - min) / 60;
                return "" + hs + "horas, " + min + " minutos";
            }
            return "";
        },
        aplicarFiltros(marca, modelo, año) {
            marca = marca == null ? "" : marca;
            modelo = modelo == null ? "" : modelo;
            año = año == null ? "" : año;

            if (!marca && !modelo && !año && !this.filtros.BranchOffice) {
                return
            }
            this.serviciosFiltrados = [];
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
            this.cliente = client;
            let vehiculos = [];
            this.clientes.forEach(cliente => {
                if (cliente._id == client) {
                    cliente.Vehicle.forEach(vehiculo => {
                        vehiculos.push(vehiculo);
                    })
                }
                this.vehicles = vehiculos
            });
        },

        obtenerVehiculo() {
            axios.get(urlAPI + 'vehicle/' + this.vehiculo._id)
                .then(res => {
                    if (res.data != null) {
                        this.vehicle = res.data.vehicle;
                        this.filtros.Model = this.vehicle.Model;
                        this.filtros.Brand = this.vehicle.Brand;
                        this.filtros.year = this.vehicle.year;

                        this.clientes.forEach(cliente => {
                            if (cliente._id == this.cliente) {
                                cliente.Vehicle.forEach(vehiculo => {
                                    if (vehiculo.VehicleID == this.vehiculo) {
                                        this.Domain = vehiculo.Domain;
                                    };
                                })
                            }
                        });
                       localStorage.setItem("cliente", JSON.stringify({
                            "cliente": this.cliente,
                            "vehiculo": this.vehicle,
                            "domain": this.Domain,
                        }));
                        let sucursal = this.sucursales.filter(sucursal => sucursal.Name == this.filtros.BranchOffice);
                        if (sucursal != null) {
                            localStorage.removeItem("sucursal");
                            localStorage.setItem("sucursal", JSON.stringify(sucursal[0]));
                        }
                        this.serviciosFiltrados = [];
                        this.aplicarFiltros(res.data.vehicle.Brand, res.data.vehicle.Model, res.data.vehicle.year);
                    }
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
        
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        corroborarService() {
            location.href = "/turno";
        },

    }
};
</script>

<style>

</style>
