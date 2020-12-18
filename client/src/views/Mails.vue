<template>
<div>
    <v-row>
        <v-col cols="12" md="6">
            <v-form ref="formP" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Primer Recordatorio</h2>
                        <v-btn icon rigth @click="editarPrimero">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-text>
                        <v-text-field :disabled="desPrimero" label="Título" v-model="primero.titulo" :rules="requerido"></v-text-field>
                        <v-textarea :disabled="desPrimero" v-model="primero.descripcion" :rules="requerido"></v-textarea>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select label="Frecuencia en Días" :disabled="desPrimero" :items="dias" v-model="primero.dias" ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select label="Frecuencia en Horas" :disabled="desPrimero" :items="horas" v-model="primero.horas" ></v-select>
                            </v-col>
                        </v-row>
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
        </v-col>
        <v-col cols="12" md="6">
            <v-form ref="formS" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Segundo Recordatorio</h2>
                        <v-btn icon right @click="editarSegundo">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field :disabled="desSegundo" v-model="segundo.titulo" label="Título" :rules="requerido"></v-text-field>
                        <v-textarea :disabled="desSegundo" v-model="segundo.descripcion" label="Descripción" :rules="requerido"></v-textarea>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select label="Frecuencia en Días" :disabled="desSegundo" :items="dias" v-model="segundo.dias"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select label="Frecuencia en Horas" :disabled="desSegundo" :items="horas" v-model="segundo.horas" ></v-select>
                            </v-col>
                        </v-row>
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
        </v-col>
    </v-row>
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
        this.getConfig();
        this.inicializarDias();
        this.inicializarHoras();
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
