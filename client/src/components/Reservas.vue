<template>
<div>
    <!--Filtros-->
    <template v-if="consulta">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="indigo darken-4 white--text">
                    Ver filtros Disponibles
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-container>
                        <h2>Filtros</h2>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-select label="Sucursal" v-model="filtroSucursal" :items="sucursales" item-text="Name" item-value="Name"></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select label="ID del cliente" v-model="filtroCliente" :items="clientes" item-text="DNI" item-value="_id" @change="client=>cambiarVehiculo(client)"></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select v-model="vehiculo" label="Dominio del Vehículo" :items="vehicles" item-text="Domain" item-value="VehicleID"></v-select>
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

    <!--Info, Editar, Nuevo y Modificar!-->
    <template>
        <v-toolbar flat>
            <v-flex class="text-right">
                <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on" @click="info=true">
                    <v-icon>mdi-information-outline</v-icon>
                </v-btn>
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="nuevoTurno=true">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-flex>
        </v-toolbar>
    </template>

    <v-dialog v-model="nuevoTurno" max-width="400px">
        <v-card>
            <v-card-title>
                <h1>Día y Horario</h1>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="date" label="Día" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker ref="picker" v-model="date" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="save"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select label="Horario" :items="horarios"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on" @click="nuevoTurno=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-if="consulta==false" v-model="info" max-width="500px">
        <v-card>
            <v-flex class="text-center">
                <v-card-title>
                    <v-flex class="text-center">
                        <h2>Detalle de Reserva</h2>
                    </v-flex>
                </v-card-title>
                <v-card-text>
                    <h3>Sucursal: </h3>
                    <p>{{sucursal}}</p>

                    <h3>Vehículo: </h3>
                    <p>{{cliente.vehiculo.Brand}}-{{cliente.vehiculo.Model}}-{{cliente.vehiculo.year}}</p>

                    <h3>Duración: </h3>
                    <p>{{detalle.tiempoTotal}}</p>

                    <h3>Precio: </h3>
                    <p>{{detalle.tiempoTotal}}</p>

                    <h3>Descuentos: </h3>
                    <p>N/A</p>

                    <h3>Fecha y Hora de Reserva: </h3>
                    <p>No definida</p>

                </v-card-text>
            </v-flex>
        </v-card>
    </v-dialog>

    <v-sheet tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select v-model="typeEs" :items="typesEs" dense outlined hide-details class="ma-2" label="Tipo de Vista" @change="cambiarTipo"></v-select>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </v-sheet>
    <v-sheet height="600">
        <v-calendar ref="calendar" :weekdays="[1, 2, 3, 4, 5, 6, 0]" locale="es" :short-weekdays="false" v-model="value" :type="type" :events="events" :event-overlap-mode="mode" :event-overlap-threshold="30" :event-color="getEventColor"></v-calendar>
    </v-sheet>
</div>
</template>

<script>
import axios from "axios"
export default {
    created() {
        let direccionActual = String(location.href);
        if (direccionActual.includes("/turno")) {
            this.consulta = false;

            let sucursal = JSON.parse(localStorage.getItem("sucursal"));
            let carrito = JSON.parse(localStorage.getItem("carrito"));
            let cliente = JSON.parse(localStorage.getItem("cliente"));
            //console.log("carrito: " + carrito);
            //console.log("carrito: " + JSON.stringify(carrito));
            if (carrito != null) {
                this.detalle = carrito;
            };
            if (cliente != null) {
                this.cliente = cliente;
            };
            if (sucursal != null) {
                this.getReservas(sucursal._id);
                this.sucursal = sucursal.Name;
            }

        } else {
            this.consulta = true;
            this.getAllReservas();
        }
        this.getSucursales();
        this.getClientes();
        this.getVehiculo();

    },
    data: () => ({
        consulta: false,
        cliente: {},
        clientes: [],
        vehiculo: {},
        vehicles: [],
        sucursal: '',
        filtroSucursal: '',
        filtroCliente: '',
        sucursales: [],
        reservas: [],
        horarios: ['08:00', '08:30', '9:00', '9:30', '10:00', '10:30'],
        attrs: '',
        on: '',
        info: false,
        nuevoTurno: false,
        date: null,
        menu: false,
        type: 'month',
        typeEs: 'Mes',
        typesEs: ['Mes', 'Semana', 'Día'],
        types: ['month', 'week', 'day'],
        mode: 'stack',
        modes: ['stack', 'column'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        events: [],
        weekdays: [{
                text: 'Sun - Sat',
                value: [0, 1, 2, 3, 4, 5, 6]
            },
            {
                text: 'Mon - Sun',
                value: [1, 2, 3, 4, 5, 6, 0]
            },
            {
                text: 'Mon - Fri',
                value: [1, 2, 3, 4, 5]
            },
            {
                text: 'Mon, Wed, Fri',
                value: [1, 3, 5]
            },
        ],
        value: '',
        colors: ['grey'],
        detalle: {},
        names: ['No-Disponible'],
    }),
    methods: {
        cambiarTipo() {
            if (this.typeEs === 'Mes') {
                this.type = 'month'
            }
            if (this.typeEs === 'Día') {
                this.type = 'day'
            }
            if (this.typeEs === 'Semana') {
                this.type = 'week'
            }
        },
        async getReservas(sucursal) {
            await axios.get('http://localhost:8081/reservation')
                .then(res => {
                    this.reservas = res.data.reservation.filter(reserva => reserva.Status === "ACTIVE" & reserva.BranchOffice == sucursal);
                    this.getEvents();
                });
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

        getEvents() {
            const events = []
            for (let i = 0; i < this.reservas.length; i++) {
                let desde = new Date(this.reservas[i].AppointmentTime);
                let duracion = this.reservas[i].Duration;
                let hasta = new Date(desde.getTime() + duracion * 60000);
                let sMinutesDesde = desde.getMinutes() == 0 ? "00" : String(desde.getMinutes());
                let sMinutesHasta = hasta.getMinutes() == 0 ? "00" : String(hasta.getMinutes());
                events.push({
                    name: desde.getHours() + ":" + sMinutesDesde + "-" + hasta.getHours() + ":" + sMinutesHasta + " Reservado",
                    start: desde,
                    end: hasta,
                    color: this.colors[0],
                    timed: true,
                })
            }
            this.events = events
        },
        getEventColor(event) {
            return event.color
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        save(date) {
            this.$refs.menu.save(date)
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
        aplicarFiltros() {
            if (!this.filtroSucursal && !this.vehiculo && !this.filtroCliente) {
                return;
            }
            if (this.filtroSucursal != "") {
                this.reservas = this.reservas.filter(r => r.BranchOffice.Name == this.filtroSucursal);
            }
            if (this.filtroCliente != "") {
                this.reservas = this.reservas.filter(r => r.Client == this.filtroCliente);
            }
            if (this.vehiculo!="") {
                this.reservas = this.reservas.filter(r => this.vehiculo._id == r.VehicleID);
            }
            console.log("RESERVAS: " + JSON.stringify(this.reservas));
        },
        reiniciarFiltros() {
            this.reservas = [];
            this.getAllReservas()
        },
        async getAllReservas() {
            await axios.get('http://localhost:8081/reservation')
                .then(res => {
                    this.reservas = res.data.reservation;
                });
        },
    },
    watch: {
        menu(val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
    },

}
</script>

<style>
.contA {
    background-color: "white";
    color: "white";
}
</style>
