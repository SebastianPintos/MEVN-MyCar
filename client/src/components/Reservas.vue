<template>
<div>
    <!--Filtros-->
    <template>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="indigo darken-4 white--text">
                    <template v-slot:actions>
                        <v-icon color="white">
                            $expand
                        </v-icon>
                    </template>
                    Ver filtros Disponibles
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-container>
                        <h2>Filtros</h2>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-select label="Sucursal" v-model="filtroSucursal" :items="sucursales" item-text="Name" item-value="_id"></v-select>
                            </v-col>
                            <v-col v-if="consulta==true" cols="12" md="4">
                                <v-select v-model="filtroCliente" label="ID del Cliente" :items="clientes" item-text="DNI" item-value="_id" :rules="requerido" @change="client=>cambiarVehiculo(client)">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.DNI }} - {{ data.item.Name }} {{ data.item.LastName }}
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col v-if="consulta==true" cols="12" md="4">
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
                <v-btn v-if="consulta==false" color="grey" dark class="mb-2" v-bind="attrs" v-on="on" @click="info=true">
                    <v-icon>mdi-information-outline</v-icon>
                </v-btn>
                <v-btn v-if="consulta==false" color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="nuevoTurno=true">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-flex>
        </v-toolbar>
    </template>

    <v-dialog v-model="deleteConfirm" max-width="300px" persistent>
        <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
                <h3>¿Estás seguro de que deseas eliminar esta reserva?</h3>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn color="info" dark class="mb-2" @click="deleteConfirm=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn color="info" dark class="mb-2" @click="eliminarReserva(selectedEvent);deleteConfirm=false">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="checkConfirm" max-width="300px" persistent>
        <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
                <h3>¿Estás seguro de que deseas verificar asistencia de esta reserva?</h3>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn color="info" dark class="mb-2" @click="checkConfirm=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn color="info" dark class="mb-2" @click="confirmarReserva(selectedEvent);checkConfirm=false">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="nuevoTurno" max-width="400px" persistent>
        <v-card>
            <v-card-title>
                <h1>Día y Horario</h1>
            </v-card-title>

            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="date" label="Día" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker ref="picker" v-model="date" locale="es" min="2020-11-23" @change="save" :rules="requerido"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select :label="texto" v-model="horario" :disabled="!mostrarHorario" :items="horarios" :rules="requerido"></v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea label="Detalles" v-model="detalleReserva"></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on" @click="nuevoTurno=false;date=null;horarios=[]">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on" @click="crearReserva">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

    <v-dialog v-if="consulta==false & cliente!=null" v-model="info" max-width="500px">
        <v-card>
            <v-flex class="text-center">
                <v-card-title>
                    <v-flex class="text-center">
                        <h2>Detalle de Reserva</h2>
                    </v-flex>
                </v-card-title>
                <v-card-text>
                    <h3>Sucursal: </h3>
                    <p>{{nombreSucursal}}</p>

                    <h3>Vehículo: </h3>
                    <p>{{cliente.vehiculo.Brand}}-{{cliente.vehiculo.Model}}-{{cliente.vehiculo.year}}-{{domain}}</p>

                    <h3>Duración: </h3>
                    <p>{{detalle.tiempoTotalString}}</p>

                    <h3>Precio: </h3>
                    <p>{{detalle.total}}</p>

                    <h3>Fecha y Hora de Reserva: </h3>
                    <p v-if="horaReserva!=null">{{horaReserva}}</p>
                    <p v-else>Aún no Reservado</p>

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
        <v-calendar ref="calendar" :weekdays="[1, 2, 3, 4, 5, 6, 0]" locale="es" :short-weekdays="false" v-model="value" :type="type" :events="events" :event-overlap-mode="mode" :event-overlap-threshold="30" :event-color="getEventColor" @click:event="showEvent"></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                    <v-toolbar-title v-html="selectedEvent.estado"></v-toolbar-title>

                    <v-flex class="text-right" style="margin-left:50px">
                        <v-btn icon v-if="selectedEvent.estado=='Reservado' " @click="nuevoTurno = true; editando = true">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="checkConfirm = true" v-if="selectedEvent.estado=='Reservado' ">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteConfirm = true" v-if="selectedEvent.estado=='Reservado' ">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-spacer></v-spacer>

                </v-toolbar>
                <v-card-text>
                    <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn text color="secondary" @click="selectedOpen = false">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-sheet>
    <v-dialog v-model="dialogMensaje" max-width="400px">
        <v-card>
            <v-card-title>{{tituloMensaje}}</v-card-title>
            <v-card-text>{{mensaje}}</v-card-text>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    created() {
        let direccionActual = String(location.href);

        if (direccionActual.includes("/turno")) {
            this.consulta = false;

            let sucursal = JSON.parse(localStorage.getItem("sucursal"));
            let carrito = JSON.parse(localStorage.getItem("carrito"));
            let cliente = JSON.parse(localStorage.getItem("cliente"));

            if (carrito != null) {
                this.detalle = carrito;
            };
            if (cliente != null) {
                this.cliente = cliente;
                this.domain = this.cliente.domain;
            };
            if (sucursal != null) {
                this.sucursal = sucursal;
                this.getReservas(sucursal._id);
                this.nombreSucursal = sucursal.Name;
            };

        } else {
            this.consulta = true;
            this.getAllReservas();
        }
        this.getSucursales();
        this.getClientes();
        this.getVehiculo();
        this.getRepuestos();
    },
    data: () => ({
        editando: false,
        mensaje: "",
        editedReserva: null,
        detalleReserva: "",
        valid: true,
        horaReserva: null,
        reservation: null,
        tituloMensaje: "",
        dialogMensaje: false,
        mostrarHorario: false,
        texto: "Horarios",
        disponible: 0,
        consulta: false,
        deleteConfirm: false,
        nombreSucursal: "",
        checkConfirm: false,
        cliente: null,
        clientes: [],
        domain: "",
        horario: null,
        vehiculo: {},
        vehicles: [],
        sucursal: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],
        filtroSucursal: '',
        filtroCliente: '',
        sucursales: [],
        repuestos: [],
        reservas: [],
        horarios: [],
        attrs: '',
        on: '',
        info: false,
        nuevoTurno: false,
        date: null,
        menu: false,
        type: 'week',
        typeEs: 'Semana',
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
        today: new Date(),
        value: '',
        colors: ['grey', 'yellow', 'green'],
        detalle: {},
        names: ['No-Disponible'],
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
    }),
    methods: {
        showEvent({
            nativeEvent,
            event
        }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                setTimeout(() => {
                    this.selectedOpen = true
                }, 10)
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                setTimeout(open, 10)
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
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
            await axios.get(urlAPI + 'reservation')
                .then(res => {
                    this.reservas = res.data.reservation.filter(reserva => reserva.Status === "ACTIVE" & reserva.BranchOffice._id == sucursal & new Date(reserva.AppointmentTime) >= this.today & reserva.Client != null);
                    this.getEvents();
                });
        },

        async getRepuestos() {
            await axios.get(urlAPI + 'product')
                .then(res => {
                    this.repuestos = res.data.product;
                });
        },
        async getSucursales() {
            await axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });
        },
        getClientes() {
            axios.get(urlAPI + 'client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE");
                });

        },

        async getVehiculo() {
            await axios.get(urlAPI + 'vehicle')
                .then(res => {
                    this.allVehicles = res.data.vehicle;
                });
        },

        async confirmarReserva(event) {
            await axios.delete(urlAPI + 'reservation/' + event.id + '/delete');
            this.events.splice(this.events.indexOf(event), 1)
        },

        async eliminarReserva(event) {
            await axios.delete(urlAPI + 'reservation/' + event.id + '/cancel');
            this.events.splice(this.events.indexOf(event), 1)
        },

        getEvents() {
            const events = []
            for (let i = 0; i < this.reservas.length; i++) {
                let desde = new Date(this.reservas[i].AppointmentTime);
                desde = new Date(desde.getTime() + 180 * 60000)
                let duracion = this.reservas[i].Duration;
                let hasta = new Date(desde.getTime() + duracion * 60000);
                let sHsDesde = desde.getHours() == 0 ? "00" : String(desde.getHours());
                let sMinDesde = desde.getMinutes() == 0 ? "00" : String(desde.getMinutes());
                let sMinutesHasta = hasta.getMinutes() == 0 ? "00" : String(hasta.getMinutes());
                let descripcion = "<h3>" + sHsDesde + ":" + sMinDesde + "-" + hasta.getHours() + ":" + sMinutesHasta + "</h3><h5>Dominio: </h5>" + this.reservas[i].Domain + ", <br> <h5>Cliente: </h5>" + this.reservas[i].Client.DNI + " <br><h5> Servicios a Realizar: </h5>";
                this.reservas[i].Service.forEach(s => {
                    descripcion += "<p>" + s.Description + "</p><br>";
                })
                events.push({
                    name: "Reservado",
                    start: desde.getTime(),
                    end: hasta,
                    id: this.reservas[i]._id,
                    color: this.colors[0],
                    timed: true,
                    details: descripcion,
                    estado: "Reservado"
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

        parsearAHora(time) {
            if (time != null) {
                var min = time % 60;
                var hs = (time - min) / 60;
                min = String(min).length == 1 ? "0" + min : min;
                hs = String(hs).length == 1 ? "0" + hs : hs;
                return "" + hs + ":" + min;
            }
            return "";
        },

        save(date) {
            this.$refs.menu.save(date);
            let horarios = ["", ""];
            let dia = new Date(date).getDay();
            if (this.sucursal != null) {
                try {
                    if (this.sucursal.Hours != null) {
                        if (dia == 0) {
                            if (this.sucursal.Hours.Monday != null) {
                                horarios[0] = this.sucursal.Hours.Monday.Open;
                                horarios[1] = this.sucursal.Hours.Monday.Close;
                            }
                        }
                        if (dia == 1) {
                            if (this.sucursal.Hours.Tuesday != null) {
                                horarios[0] = this.sucursal.Hours.Tuesday.Open;
                                horarios[1] = this.sucursal.Hours.Tuesday.Close;
                            }
                        }
                        if (dia == 2) {
                            if (this.sucursal.Hours.Wednesday != null) {
                                horarios[0] = this.sucursal.Hours.Wednesday.Open;
                                horarios[1] = this.sucursal.Hours.Wednesday.Close;
                            }
                        }
                        if (dia == 3) {
                            if (this.sucursal.Hours.Thrusday != null) {
                                horarios[0] = this.sucursal.Hours.Thrusday.Open;
                                horarios[1] = this.sucursal.Hours.Thrusday.Close;
                            }
                        }
                        if (dia == 4) {
                            if (this.sucursal.Hours.Friday != null) {
                                horarios[0] = this.sucursal.Hours.Friday.Open;
                                horarios[1] = this.sucursal.Hours.Friday.Close;
                            }
                        }
                        if (dia == 5) {
                            if (this.sucursal.Hours.Saturday != null) {
                                horarios[0] = this.sucursal.Hours.Saturday.Open;
                                horarios[1] = this.sucursal.Hours.Saturday.Close;
                            }
                        }
                        if (dia == 6) {
                            if (this.sucursal.Hours.Sunday != null) {
                                horarios[0] = this.sucursal.Hours.Sunday.Open;
                                horarios[1] = this.sucursal.Hours.Sunday.Close;
                            }
                        }
                    }
                    let horariosEnMin = this.calcularIntervalos(horarios);
                    if (horariosEnMin != null) {
                        horariosEnMin.forEach(horario => {
                            this.horarios.push(this.parsearAHora(horario));
                        });
                        this.texto = "Horarios";
                        this.mostrarHorario = true;
                    } else {
                        this.texto = "Cerrado";
                        this.mostrarHorario = false;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        calcularIntervalos(horarios) {
            let intervalos = [];
            let i = horarios[0];
            while (i < horarios[1]) {
                intervalos.push(i);
                i += 30;
            }
            return intervalos;
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
            this.reservas = [];
            this.getAllReservas();
            this.events = [];
            this.reservas = this.reservas.filter(r => r.Status == "ACTIVE");
            if (!this.filtroSucursal && !this.vehiculo && !this.filtroCliente) {
                return;
            }
            if (this.filtroSucursal != "") {
                this.getReservas(this.filtroSucursal);
                this.sucursal = this.sucursales.filter(s => s._id == this.filtroSucursal);
                if (this.sucursal != null) {
                    this.sucursal = this.sucursal[0];
                    this.nombreSucursal = this.sucursal.Name;
                }

            }
            if (this.filtroCliente != "") {
                this.reservas = this.reservas.filter(r => r.Client == this.filtroCliente);
            }
            if (this.vehiculo != "") {
                this.reservas = this.reservas.filter(r => this.vehiculo._id == r.VehicleID);
            }
            if (this.reservas != null) {
                this.getEvents();
            }
        },
        reiniciarFiltros() {
            this.filtroCliente = "";
            this.filtroSucursal = "";
            this.vehiculo = "";
            this.events = [];
            this.getAllReservas()
        },
        async getAllReservas() {
            await axios.get(urlAPI + 'reservation')
                .then(res => {
                    this.reservas = res.data.reservation.filter(reserva => reserva.Status === "ACTIVE" & new Date(reserva.AppointmentTime) >= this.today);
                });
        },
        validate() {
            return this.$refs.form.validate();
        },
        crearReserva() {
            console.log(this.cliente.cliente);

            console.log(JSON.stringify(this.cliente));
            if (!this.validate()) {
                return;
            }
            let date = this.date + " " + this.horario;
            let ids = this.detalle.idsServ;
            let servId = [];
            if (ids != null) {
                ids.forEach(id => {
                    servId.push(id);
                })
            }
            this.reservation = {
                "reservation": {
                    "Duration": this.detalle.tiempoTotal,
                    "Price": this.detalle.total,
                    "Status": "ACTIVE",
                    "Domain": this.domain,
                    "AppointmentTime": date,
                    "Client": this.cliente.cliente,
                    "BranchOffice": this.sucursal,
                    "Details": this.detalleReserva,
                    "Service": servId,
                    "Vehicle": {
                        "VehicleID": this.cliente.vehiculo._id,
                        "Domain": this.domain
                    }
                }
            }

            this.chequearHorario();
            this.nuevoTurno = false;
        },
        chequearHorario() {
            axios.post(urlAPI + 'reservation/checkHour', this.reservation).then(res => {
                this.disponible = res.data.occupied;
                if (this.disponible == 0) {
                    if (this.editando) {
                        this.editarReserva();
                    } else {
                        this.guardarReserva();
                    }
                } else {
                    this.tituloMensaje = "No Disponible";
                    this.mensaje = "Horario no disponible";
                    this.dialogMensaje = true;
                }
            });
        },

        getReserva(id) {
            this.reservas.forEach(r => {
                if (r._id === id) {
                    this.editedReserva = r;
                }
            })
        },

        editarReserva() {
            //Guarda 3hs de más, ver si en heroku hay que cambiarlo 
            this.getReserva(this.selectedEvent.id);

            if (this.editedReserva != null) {
                let date = this.date + " " + this.horario;
                this.reservation = {
                    "reservation": {
                        "Duration": this.editedReserva.Duration,
                        "Price": this.editedReserva.Price,
                        "Status": "ACTIVE",
                        "Domain": this.editedReserva.Vehicle.Domain,
                        "AppointmentTime": date,
                        "Client": this.editedReserva.Client,
                        "BranchOffice": this.sucursal,
                        "Details": this.detalleReserva,
                        "Service": this.editedReserva.Service,
                        "Vehicle": {
                            "VehicleID": this.editedReserva.Vehicle.VehicleID,
                            "Domain": this.editedReserva.Vehicle.Domain
                        }
                    }
                }
                axios.post(urlAPI + 'reservation/' + this.selectedEvent.id + '/update', this.reservation).then(res => {
                    if (res.data.success == null) {
                        let maxP = 0;
                        let maxS = 0
                        let max = 0;
                        for (let i = 0; i < res.data.length; i++) {
                            let repuesto = this.repuestos.filter(r => r._id == res.data[i]);
                            if (repuesto != null) {
                                if (repuesto.ShippingDealer > maxP) {
                                    maxP = repuesto.ShippingDealer;
                                }
                                if (repuesto.ShippingBranch > maxS) {
                                    maxS = repuesto.ShippingBranch;
                                }
                            }
                            max = maxP > maxS ? maxP : maxS;
                        }
                        this.tituloMensaje = "No Disponible";
                        this.mensaje = "Algunos repuestos necesarios no se encuentran disponibles. Estarán disponibles en: " + max + " días.";
                        this.dialogMensaje = true;
                        this.horaReserva = null;

                    } else {
                        this.tituloMensaje = "Reserva Actualizada con Éxito";
                        this.mensaje = "Actualización realizada con éxito. Podrá consultar/modificar su reserva en la sección Reservas.";
                        this.dialogMensaje = true;
                        this.horaReserva = String(this.reservation.reservation.AppointmentTime);
                        this.getReservas(this.sucursal._id);
                    }
                    this.detalleReserva = "",
                        this.date = null;
                    this.horario = null;
                });
            }
        },

        guardarReserva() {
            axios.post(urlAPI + 'reservation/add', this.reservation).then(res => {
                if (res.data.success == null) {
                    let maxP = 0;
                    let maxS = 0
                    let max = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        let repuesto = this.repuestos.filter(r => r._id == res.data[i]);
                        if (repuesto != null) {
                            if (repuesto.ShippingDealer > maxP) {
                                maxP = repuesto.ShippingDealer;
                            }
                            if (repuesto.ShippingBranch > maxS) {
                                maxS = repuesto.ShippingBranch;
                            }
                        }
                        max = maxP > maxS ? maxP : maxS;
                    }
                    this.tituloMensaje = "No Disponible";
                    this.mensaje = "Algunos repuestos necesarios no se encuentran disponibles. Estarán disponibles en: " + max + " días.";
                    this.dialogMensaje = true;
                    this.horaReserva = null;

                } else {
                    this.tituloMensaje = "Reserva Exitosa";
                    this.mensaje = "Reserva realizada con éxito. Podrá consultar/modificar su reserva en la sección Reservas.";
                    this.dialogMensaje = true;
                    this.horaReserva = String(this.reservation.reservation.AppointmentTime);
                    this.getReservas(this.sucursal._id);
                }
                this.detalleReserva = "",
                    this.date = null;
                this.horario = null;
            });
        }

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
