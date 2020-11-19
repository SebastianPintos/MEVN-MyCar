<template>
<div>
    <!--Filtros-->
    <template>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="indigo darken-4 white--text">
                    Ver filtros Disponibles
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-container>
                        <h2>Filtros</h2>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-select v-model="filtros.BranchOffice" :items="sucursales" item-text="Name" item-value="Name" label="Sucursal"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="filtros.Model" label="Modelo-Vehículo"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="filtros.Brand" label="Marca-Vehículo"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="3">
                                <v-text-field v-model="filtros.Year" label="Año-Vehículo"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-btn class="success" @click="aplicarFiltros">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-btn class="warning" @click="reiniciarFiltros">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </template>

    <v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_id" class="elevation-1">
        <template v-slot:item.actions="{ item }">

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
                    <v-btn class="info mb-2" @click="aceptarCarrito">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="elegirCliente" max-width="300px">
        <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title>Elección del Vehículo</v-card-title>
                <v-card-text>
                    <v-select label="ID del cliente" v-model="cliente" :items="clientes" item-text="DNI" item-value="_id" @change="client=>cambiarVehiculo(client)" :rules="requerido"></v-select>
                    <v-select v-model="vehiculo" label="Dominio del Vehículo" :items="vehicles" item-text="Domain" item-value="Vehicle._id" @change="guardarCliente" :rules="requerido">
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info mb-2">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn v-if="aceptado==false" class="info mb-2" @click="validarDatos">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn class="warning mb-2" v-else :to="'/calendario'">
                            <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

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
        aceptado: false,
        dialogCalendario: false,
        valid: true,
        deleteCarritoConfirm: false,
        filtros: [{
            BranchOffice: '',
            Model: '',
            Brand: '',
            Year: '',
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
        elegirCliente: false,
        serviciosCarrito: [],
        selected: [],
        singleSelect: true,
        search: '',
        on: '',
        attrs: '',
        snackbar: false,
        mensaje: '',
        dialogCarrito: false,

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
                value: 'Vehicle.Year'
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
            if (this.servicios.length > 0) {
                this.servicios.forEach(servicio => {
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

        verificarSeleccionado() {
            if (this.selected.length == 0) {
                this.snackbar = true;
                this.mensaje = 'No ha seleccionado ningún elemento!';
                return false;
            }
            return true;
        },

        aplicarFiltros() {
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let Model = this.filtros.Model != null & this.filtros.Model != ""
            let BranchOffice = this.filtros.BranchOffice != null & this.filtros.BranchOffice != ""
            let Year = this.filtros.Year != null & this.filtros.Year != ""

            if (!Brand && !Model && !Year && !BranchOffice) {
                return
            }
            let BrandMatches = true
            let ModelMatches = true
            let BranchOfficeMatches = true
            let YearMatches = true
            let serviciosAux = []
            let cant = 0
            for (var i = 0; i < this.servicios.length; i++) {
                BrandMatches = Brand ? this.servicios[i].Vehicle.Brand === this.filtros.Brand : BrandMatches
                ModelMatches = Model ? this.servicios[i].Vehicle.Model === this.filtros.Model : ModelMatches
                BranchOfficeMatches = BranchOffice ? this.servicios[i].BranchOffice.Name === this.filtros.BranchOffice : BranchOfficeMatches
                YearMatches = Year ? this.servicios[i].Vehicle.Year == this.filtros.Year : YearMatches

                if (BrandMatches & ModelMatches & BranchOfficeMatches & YearMatches) {
                    serviciosAux[cant] = this.servicios[i]
                    cant++
                }
            }
            this.serviciosFiltrados = serviciosAux;
        },
        reiniciarFiltros() {
            this.filtros = [{
                BranchOffice: '',
                Brand: '',
                Model: '',
                Year: '',
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
            this.guardarCliente();
        },

        guardarCliente() {
            localStorage.setItem("cliente", JSON.stringify({
                "cliente": this.cliente,
                "vehiculo": this.vehiculo
            }))
        },

        validarDatos() {
            if (this.$refs.form.validate()) {
                this.aceptado = true;
            } else {
                this.aceptado = false;
            }
        }

    }
};
</script>

<style>

</style>
