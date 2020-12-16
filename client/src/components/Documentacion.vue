<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="documentation" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details single-select></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Administrativo')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editar">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="corroborarSeleccionado">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogNuevo=true; nuevo=true; titulo='Nuevo Documento'">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </div>

                </v-toolbar>
            </template>
        </v-data-table>

        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" text v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <v-dialog v-model="dialogNuevo" max-width="600px" persistent>
            <v-card>
                <v-card-title>{{titulo}}</v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                        <v-text-field v-model="editedItem.Name" label="Nombre" :rules="requerido"></v-text-field>
                        <v-row>
                        <v-col cols="12" md="4">
                        <v-text-field type="number" v-model="editedItem.EstimatedTime" label="Duración estimada(días)" :rules="requerido"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="8">
                        <v-select :items="alcance" v-model="editedItem.Origin" label="Alcance" :rules="requerido"></v-select>
                        </v-col></v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mb-2 info" @click="reset">
                                <v-icon>mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn class="mb-2 info" @click="guardar">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
            <v-card>
                <v-card-title class="headline">¿Estás seguro de que deseas eliminarlo?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="info" text @click="dialogDelete=false;selected=[]">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info" text @click="eliminar">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        dialogMensaje: false,
        mensaje: '',
        nuevo: false,
        valid: true,
        dialogNuevo: false,
        snackbar: false,
        dialogConfirm: false,
        titulo: '',
        menu: false,
        selected: [],
        date: null,
        dialogDelete: false,
        documentation: [],
        search: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        alcance: ["NACIONAL", "IMPORTADO", "GENERAL","USADO"],

        editedItem: {
            Name: '',
            Origin: '',
            EstimatedTime: 0,
        },
        defaultItem: {
            Name: '',
            Origin: '',
            EstimatedTime: 0,

        },
        headers: [{
                text: 'Nombre',
                value: 'Name',
                align: 'start',
            },
            {
                text: 'Tiempo Estimado(días)',
                value: 'EstimatedTime',
            },
            {
                text: 'Alcance',
                value: 'Origin',
            },
        ],
        sucursales: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        employee: null,
   }),

    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getDocumentation(this.branchOffice);
        this.getSucursales();
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        async getDocumentation(branchOffice) {
            await axios.get(urlAPI + 'documentation')
                .then(res => {
                    let documentation = res.data.documentation;
                    if (documentation != null) {
                        this.documentation = documentation.filter(d => d.Status == "ACTIVE");
                        if (branchOffice != "") {
                            this.documentation = this.documentation.filter(d => d.BranchOffice._id == branchOffice);
                        }
                    }
                })
        },

        async getSucursales() {
            await axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    let sucursales = res.data.branchOffice;
                    if (sucursales != null) {
                        sucursales.forEach(s => {
                            if (s.Status === "ACTIVE") {
                                this.sucursales.push(s);
                            }
                        })
                    }
                })
        },
        
        guardar() {
            if (this.validate()) {
                let auxDocumentation = {
                    "documentation": {
                        "Name": this.editedItem.Name,
                        "EstimatedTime": parseInt(this.editedItem.EstimatedTime),
                        "Origin": this.editedItem.Origin,
                        "BranchOffice": this.employee.BranchOffice,
                        "Status":"ACTIVE"
                    }
                };
                if (this.nuevo == true) {
                    axios.post(urlAPI + "documentation/add", auxDocumentation).then(res => {
                        if (res != null) {
                            this.editedItem = this.defaultItem;
                            this.documentation = [];
                            this.getDocumentation(this.branchOffice);
                            this.reset();
                        }
                    })

                } else {
                    axios.post(urlAPI + "documentation/" + this.selected[0]._id + "/update", auxDocumentation).then(res => {
                        if (res != null) {
                            this.documentation = [];
                            this.editedItem = this.defaultItem;
                            this.getDocumentation(this.branchOffice);
                            this.reset();
                        }
                    })
                }
            }
        },

        eliminar() {
            axios.delete(urlAPI + "documentation/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.documentation.splice(this.documentation.indexOf(this.selected[0]), 1)
                    this.selected = [];
                    this.dialogDelete = false;
                    this.reset();
                }
            })

        },
        corroborarSeleccionado() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.dialogDelete = true;
        },
        editar() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.editedItem.Name = this.selected[0].Name;
            this.editedItem.EstimatedTime = this.selected[0].EstimatedTime;
            this.editedItem.Origin = this.selected[0].Origin;
            this.titulo = "Editar Documento";
            this.dialogNuevo = true;
        },

        validate() {
            return this.$refs.form.validate();
        },

        reset() {
            if (this.dialogNuevo) {
                this.$refs.form.resetValidation();
            }
            this.editedItem = this.defaultItem;
            this.dialogNuevo = false;
            this.nuevo = false;
        }
    },

};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.btnMasMenos {
    margin: -10%;
}

.izq {
    align: left;
    margin-left: -90%;
}
</style>
