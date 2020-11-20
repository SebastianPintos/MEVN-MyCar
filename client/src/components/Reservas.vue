<template>
<div>

    <template>
        <br>
        <v-card>
        
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
            <v-card-actions>
            <v-btn class="warning" block>Reservar</v-btn>
            </v-card-actions>
        </v-card>

    </template>

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
    created(){

        let sucursal = JSON.parse(localStorage.getItem("sucursal"));
        let id = sucursal.id;
       console.log("SUCURSAL: "+JSON.stringify(sucursal)+" id "+id);
       if(sucursal!= null){
           this.getReservas(sucursal.id);
       }
        let direccionActual = String(location.href);
        if(direccionActual.includes("/turno")){
            console.log("Calendario!");
        }
        else{
            console.log("Reserva");
        }
    },
    data: () => ({
        reservas: [],
        horarios: ['08:00', '08:30', '9:00', '9:30', '10:00', '10:30'],
        attrs: '',
        on: '',
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
                   console.log(JSON.stringify(this.reservas));
                    this.getEvents();
                });
        },
        getEvents() {
            const events = []
           for (let i = 0; i <this.reservas.length; i++) {
               let desde = new Date(this.reservas[i].AppointmentTime);
               let duracion = this.reservas[i].Duration;
               let hasta = new Date(desde.getTime() + duracion * 60000 );
                let sMinutesDesde = desde.getMinutes() == 0 ? "00": String(desde.getMinutes());
                let sMinutesHasta = hasta.getMinutes() == 0 ? "00": String(hasta.getMinutes());
                events.push({
                    name: desde.getHours()+":"+sMinutesDesde+"-"+hasta.getHours()+":"+sMinutesHasta+" Reservado",
                    start: desde,
                    end: hasta,
                    color: this.colors[0],
                    timed: false,
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
