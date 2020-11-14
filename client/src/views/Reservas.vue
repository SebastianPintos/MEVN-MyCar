<template>
      <div class="page">
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="typeEs"
        :items="typesEs"
        dense
        outlined
        hide-details
        class="ma-2"
        label="Tipo de Vista"
        @change="cambiarTipo"
      ></v-select>

        <v-select
        :items="tipoServicio"
        dense
        outlined
        hide-details
        class="ma-2"
        label="Tipo de Reserva"
      ></v-select>

       <v-select
        :items="sucursales"
        dense
        outlined
        hide-details
        class="ma-2"
        label="Sucursal"
      ></v-select>

      <v-spacer></v-spacer>
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        locale="es"
        :short-weekdays="false"
        v-model="value"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"
      ></v-calendar>
    </v-sheet>
  </div>
</template>

<script>
  export default {
    data: () => ({
    tipoServicio: ['Manenimiento','Service'],
     sucursales: ['Sucursal A','Sucursal B'],
      type: 'month',
      typeEs: 'Mes',
      typesEs: ['Mes','Semana','Día'],
      types: ['month', 'week', 'day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: '',
      events: [],
      colors: ['green', 'red'],
      names: ['Disponible', 'No-Disponible'],
    }),
    methods: {
        cambiarTipo(){
            if(this.typeEs==='Mes'){
                this.type='month'
            }
            if(this.typeEs==='Día'){
                this.type='day'
            }
            if(this.typeEs==='Semana'){
                this.type='week'
            }
        },
      getEvents ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)
          const nameElegido = this.names[this.rnd(0, this.names.length - 1)]
          const index = nameElegido == 'Disponible' ? 0 : 1
       
          events.push({
            name: nameElegido,
            start: first,
            end: second,
            color: this.colors[index],
            timed: !allDay,
          })
        }

        this.events = events
      },
      getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>
<style>
.contA {
    background-color: "white";
    color:"white";
}
</style>