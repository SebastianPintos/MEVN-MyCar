<template>
<div>
            <v-form ref="formP" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Tarjeta</h2>
                        <v-btn icon rigth @click="editarPrimero">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field label="Monto" :disabled="desPrimero"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn icon right :disabled="desPrimero" @click="guardarPrimero">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-form>
          <v-form ref="formS" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Transferencia</h2>
                        <v-btn icon right @click="editarSegundo">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                    
                    <v-text-field label="Monto" :disabled="desSegundo"></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn icon right :disabled="desSegundo" @click="guardarSegundo">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-form>
</div>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        dias: [],
        horas: [],
        primero: {
            dias: "",
            horas: "",
            titulo: "",
            descripcion: "",
            id: "",
        },
        segundo: {
            dias: "",
            horas: "",
            titulo: "",
            descripcion: "",
            id: "",
        },
        valid: true,
        desPrimero: true,
        desSegundo: true,
        numeroRequerido: [
            value => {
                const pattern = /^[0-9]$/
                return pattern.test(value) || 'Requerido.'
            },
        ],

        requerido: [
            value => !!value || 'Requerido.',
        ],
    }),
    created() {
        //this.getConfig();
        //this.inicializarDias();
        //this.inicializarHoras();
    },
    methods: {
        guardarPrimero() {
            if (this.$refs.formP.validate()) {
                if (this.recordatorios.length == 0) {
                    this.createRecordatorio(this.primero);
                    //Create
                } else {
                    //update
                   this.updateRecordatorio(this.primero);
                }
                this.desPrimero = true;
            }
        },
        guardarSegundo() {
            if (this.$refs.formS.validate()) {
                if (this.recordatorios.length == 0 || this.recordatorios.length == 1) {
                    //Create
                    this.createRecordatorio(this.segundo);
                } else {

                    //update
                    this.updateRecordatorio(this.segundo);
                }
                this.desSegundo = true;
            }
        },
        async createRecordatorio(recordatorio) {
            await axios.post(urlAPI + 'remainder/add', JSON.stringify(recordatorio)).then(res => {
                recordatorio.titulo = res.Title;
                recordatorio.descripcion = res.Body;
                recordatorio.dias = res.Interval.Days;
                recordatorio.horas = res.Interval.Hours;
            })
        },
        async updateRecordatorio(recordatorio) {
           await axios.post(urlAPI + 'remainder/' + recordatorio.id + "/update", {
                "remainder": {
                    "Title": recordatorio.titulo,
                    "Body": recordatorio.descripcion,
                    "Interval": {
                        "Hours": recordatorio.horas,
                        "Days": recordatorio.dias,
                    },
                    "Status": "ACTIVE"
                }
            });
        },
        async getConfig() {
            await axios.get(urlAPI + 'remainder').then(res => {
                this.recordatorios = res.data.remainder;
                if (this.recordatorios != null) {
                    if (this.recordatorios[0] != null) {
                        this.primero.titulo = this.recordatorios[0].Title;
                        this.primero.descripcion = this.recordatorios[0].Body;
                        this.primero.dias = this.recordatorios[0].Interval.Days;
                        this.primero.horas = this.recordatorios[0].Interval.Hours;
                        this.primero.id = this.recordatorios[0]._id;
                    }
                    if (this.recordatorios[1] != null) {
                        this.segundo.titulo = this.recordatorios[1].Title;
                        this.segundo.descripcion = this.recordatorios[1].Body;
                        this.segundo.dias = this.recordatorios[1].Interval.Days;
                        this.segundo.horas = this.recordatorios[1].Interval.Hours;
                        this.segundo.id = this.recordatorios[1]._id;
                    }
                }
            });

        },
        editarPrimero() {
            this.desPrimero = !this.desPrimero;
        },
        editarSegundo() {
            this.desSegundo = !this.desSegundo;
        },
        inicializarHoras() {
            for (let i = 0; i < 25; i++) {
                this.horas.push(i);
            }
        },
        inicializarDias() {
            for (let i = 0; i < 31; i++) {
                this.dias.push(i);
            }
        }
    },
}
</script>
