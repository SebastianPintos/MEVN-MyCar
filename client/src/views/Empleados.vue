<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table single-select v-model="selected" show-select :headers="headers" :items="empleados" :search="search" item-key="_id" sort-by="User" class="elevation-1">
            <template #item.FullName="{ item }">{{ item.Name }} {{ item.LastName }}</template>
            <template #item.Date="{ item }">{{ new Date(item.StartDate).getDate() + '-' + (new Date(item.StartDate).getMonth() + 1) + '-' +  new Date(item.StartDate).getFullYear()}}</template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div>
                    <v-btn color="primary" dark class="mb-2" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" @click="deleteItem()">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" max-width="500px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-form ref="form" v-if="selected.length <= 1" v-model="valid" lazy-validation>

                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.Name" label="Nombre" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.LastName" label="Apellido" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.DNI" label="DNI" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.Email" label="Email" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select v-model="editedItem.Hierarchy" :items="roles" label="Jerarquía" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select v-model="editedItem.BranchOffice" :items="branchOffices" item-text="Name" item-value="_id" label="Sucursal" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.User" label="Usuario" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.Password" type="password" label="Contraseña" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select v-model="editedItem.Address.Country" :items="paises" item-text="Name" item-value="Name" label="Pais" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select v-model="editedItem.Address.Province" :items="provincias" item-text="Name" item-value="Name" label="Provincia" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select v-model="editedItem.Address.City" :items="localidades" item-text="Name" item-value="Name" label="Ciudad" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.Address.Street" label="Calle" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.Address.Number" type="number" label="Numero" :rules="requerido"></v-text-field>
                                            </v-col>

                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="info" text @click="reset();close()">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="save">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>

                        <v-card>
                            <v-form ref="editarVarios" v-if="selected.length > 1" v-model="valid" lazy-validation>

                                <v-card-title>
                                    <span class="headline">Editar varios</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>

                                            <v-col cols="12" sm="12" md="12">
                                                <v-btn-toggle v-model="toggle_none">
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-plus</v-icon>
                                                    </v-btn>
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-minus</v-icon>
                                                    </v-btn>
                                                </v-btn-toggle>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-select v-model="editedItem.Hierarchy" :items="jerarquias" label="Jerarquía" :rules="requerido"></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-flex class="text-right">
                                    <v-btn class="mb-2 info" text @click="reset();close()">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="mb-2 info"  text @click="save">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    </v-flex>
                                </v-card-actions>
                            </v-form>
                        </v-card>

                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                        <v-card>
                            <v-card-title>Confirmación</v-card-title>
                            <v-card-text>
                                <h3>¿Estás seguro de que deseas eliminar este usuario?</h3>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="info" text @click="closeDelete">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                                <v-btn class="info" text @click="deleteItemConfirm">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </div>

                </v-toolbar>
            </template>

        </v-data-table>
        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-check</v-icon>
                </v-btn>

            </template>
        </v-snackbar>
    </div>
</v-img>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        expanded: [],
        editedIndex: -1,
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        requerido: [
            value => !!value || 'Requerido.',
        ],

        paises: [],
        provincias: [],
        localidades: [],
        branchOffices: [],
        roles: ["Gerente", "Administrador", "Administrativo", "Supervisor", "Supervisor Taller", "Vendedor"],

        editedItem: {
            Name: '',
            LastName: '',
            DNI: '',
            Email: '',
            Hierarchy: '',
            User: '',
            Address: {
                Country: '',
                City: '',
                Address: '',
                Number: '',
                Street: '',
            },
            StartDate: '',
        },

        defaultItem: {
            Name: '',
            LastName: '',
            DNI: '',
            Email: '',
            Hierarchy: '',
            User: '',
            Address: {},
            StartDate: '',
            
        },
        headers: [{
                text: 'Nombre y Apellido',
                value: 'FullName',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Usuario',
                value: 'User'
            },
            {
                text: 'DNI',
                value: 'DNI',
            },
            {
                text: 'Email',
                value: 'Email'
            },
            {
                text: 'Jerarquía',
                value: 'Hierarchy'
            },
            {
                text: 'Fecha de Inicio',
                value: 'Date'
            },
        ],

        empleados: [],
        formTitle: "Nuevo Empleado",

    }),

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.iniciar();
    },

    methods: {
        iniciar() {
            this.getEmployees();
            this.getPaises();
            this.getProvincias();
            this.getLocalidades();
            this.getBranchOffices();
        },

        getEmployees() {
            axios.get(urlAPI + 'employee')
                .then(res => {
                    this.empleados = res.data.employee.filter(s => s.Status === "ACTIVE")
                });
        },
        createEmployee(){
            axios.post(urlAPI + 'signup', {
                "employee": {
                    "User": this.editedItem.User,
                    "Password": this.editedItem.Password,
                    "Name": this.editedItem.Name,
                    "LastName": this.editedItem.LastName,
                    "DNI": this.editedItem.DNI,
                    "Email": this.editedItem.Email,
                    "Hierarchy": this.editedItem.Hierarchy,
                    "StartDate": new Date(),
                    "BranchOffice": this.editedItem.BranchOffice,
                    "Status": this.editedItem.Address.Status,
                    "Address": {
                        "Country": this.editedItem.Address.Country,
                        "Province": this.editedItem.Address.Province,
                        "Street": this.editedItem.Address.Street,
                        "Number": this.editedItem.Address.Number,
                        "City": this.editedItem.Address.City,
                    }
                }
            })
            .then(() => {this.getEmployees(); this.reset()})
        },

        updateEmployee(){
            console.log(this.editedItem.Password)
            console.log(this.editedItem.BranchOffice)
            axios.post(urlAPI + 'employee/' + this.selected[0]._id +'/update', {
                "employee": {
                    "User": this.editedItem.User,
                    "Password": this.editedItem.Password,
                    "Name": this.editedItem.Name,
                    "LastName": this.editedItem.LastName,
                    "DNI": this.editedItem.DNI,
                    "Email": this.editedItem.Email,
                    "Hierarchy": this.editedItem.Hierarchy,
                    "StartDate": this.editedItem.StartDate,
                    "BranchOffice": this.editedItem.BranchOffice,
                    "Status": this.editedItem.Address.Status,
                    "Address": {
                        "Country": this.editedItem.Address.Country,
                        "Province": this.editedItem.Address.Province,
                        "Street": this.editedItem.Address.Street,
                        "Number": this.editedItem.Address.Number,
                        "City": this.editedItem.Address.City,
                    }
                }
            })
            .then(() => {this.getEmployees(); this.reset()})
        },

        deleteEmpleado(item) {
            axios.delete(urlAPI + 'employee/' + item._id + '/delete').then(res => {
                if (res != null) {
                    this.reset();
                }
            })
        },

        getPaises() {
            axios.get(urlAPI + 'paises')
                .then(res => {
                    this.paises = res.data.paises;
                    this.paises.sort();
                });

        },
        getProvincias() {
            axios.get(urlAPI + 'provincias')
                .then(res => {
                    this.provincias = res.data.provincias;
                    this.provincias.sort();
                });
        },

        getLocalidades(nombre) {
            axios.get(urlAPI + 'localidades')
                .then(res => {
                    this.localidades = res.data.localidades;
                    this.localidades.sort();
                });
        },

        getBranchOffices() {
            axios.get(urlAPI + 'branchoffice')
                .then(res => {
                    this.branchOffices = res.data.branchOffice;
                });
        },

        haySeleccionado() {
            return this.selected.length > 0;
        },

        mensajeNoSelecciono() {
            if (!this.haySeleccionado()) {
                this.snackbar = true
                this.mensaje = "No ha seleccionado ningun elemento!"
                return true;
            }
            return false;
        },

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if (this.selected.length > 1) {
                    this.snackbar = true
                    this.mensaje = "Sólo puede editar un elemento a la vez!"
                    return;
                }
                this.editedIndex = this.empleados.indexOf(item);
                this.formTitle = "Editar Empleado";
                this.editedItem = Object.assign({}, item)
                this.dialog = true;
            }
        },

        deleteItem() {
            if(this.selected.length==0){
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.empleados.splice(this.empleados.indexOf(item), 1)
                this.deleteEmpleado(item)
            });
            this.closeDelete()
        },

        reset() {
            this.selected = [];
            if(this.dialog){
                this.$refs.form.resetValidation()
            }
            this.formTitle = "Nuevo Empleado";
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        close() {
            this.dialog = false
        },

        closeDelete() {
            this.dialogDelete = false
            this.reset()
        },

        validate() {
            return this.$refs.form.validate()
        },

        save() {
            if (this.editedIndex > -1) {
                if (this.validate()) {
                    Object.assign(this.empleados[this.editedIndex], this.editedItem)
                       this.formTitle ="Editar Empleado";
                    this.updateEmployee();
                }
            } else {
                if (this.selected.length > 1) {
                    if (this.$refs.editarVarios.validate()) {
                        this.formTitle ="Editar Empleado";
                        this.updateManyEmployees()
                    }
                } else {
                    if (this.validate()) {
                        this.formTitle ="Nuevo Empleado";
                        this.empleados.push(this.editedItem);
                        this.createEmployee();
                    }
                }

            }
            this.close()
            }
        },

        reiniciar() {
            this.close();
            this.selected = [];
            this.editedItem = this.defaultItem;
            this.$refs.form.resetValidation();
        },

}
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.mb-4 {
    width: 12%;
    margin-left: -10%;
}

p,
.motivos {
    text-align: center;
    font-size: 4%;
}
</style>

