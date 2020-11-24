<template>
<div>
    <v-row>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-title>
                    <h2>Primer Recordatorio</h2>
                    <v-btn icon rigth @click="editarPrimero">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-text-field :disabled="desPrimero" label="Título"></v-text-field>
                    <v-textarea :disabled="desPrimero" label="Descripción"></v-textarea>
                    <v-row>
                    <v-col cols="12" md="6">
                    <v-select label="Frecuencia en Días" :disabled="desPrimero" :items="dias" v-model="diasPrimero"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-select label="Frecuencia en Horas" :disabled="desPrimero" :items="horas" v-model="horasPrimero"></v-select>
                    </v-col></v-row>
                </v-card-text>
                <v-card-actions>
                     <v-flex class="text-right">
                        <v-btn icon right :disabled="desPrimero">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                    </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-title>
                    <h2>Segundo Recordatorio</h2>
                    <v-btn icon right @click="editarSegundo">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-text-field :disabled="desSegundo" label="Título"></v-text-field>
                    <v-textarea :disabled="desSegundo" label="Descripción"></v-textarea>
                <v-row>
                    <v-col cols="12" md="6">
                    <v-select label="Frecuencia en Días" :disabled="desSegundo" :items="dias" v-model="diasSegundo"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-select label="Frecuencia en Horas" :disabled="desSegundo" :items="horas" v-model="horasSegundo"></v-select>
                    </v-col></v-row>
                </v-card-text>
               
                    <v-card-actions>
                     <v-flex class="text-right">
                        <v-btn icon right :disabled="desSegundo">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                    </v-card-actions>
                
            </v-card>
        </v-col>
    </v-row>
</div>
</template>

<script>
export default {
    data: () => ({
        dias: [],
        horas: [],
        diasPrimero: null,
        horasPrimero: null,
        horasSegundo: null,
        diasSegundo: null,
        desPrimero: true,
        desSegundo: true,
    }),
    created() {
        this.inicializarDias();
        this.inicializarHoras();
    },
    methods: {
        editarPrimero() {
            this.desPrimero = !this.desPrimero;
            console.log("");
        },
        editarSegundo() {
            this.desSegundo = !this.desSegundo;
            console.log("");

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
