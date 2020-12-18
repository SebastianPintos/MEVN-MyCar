<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="controlProducts" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
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
                         <v-select :items="repuestos" item-text="SKU" v-model="editedItem.Product" item-value="_id" label="Repuesto" :rules="requerido">
                            <template slot="item" slot-scope="data">
                                SKU: {{ data.item.SKU }},CATEGORÍA :{{ data.item.Category }},MARCA :{{ data.item.Brand }}
                            </template>
                        </v-select>
                        <v-row>
                        <v-col cols="12" md="4">
                        <v-text-field type="number" v-model="editedItem.Min" label="Mínimo en Stock" :rules="requerido"></v-text-field>
                        </v-col>
                        </v-row>
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
        controlProducts: [],
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
            Product: '',
            Origin: '',
            Min: 0,
        },
        defaultItem: {
            Product: '',
            Origin: '',
            Min: 0,

        },
        headers: [{
                text: 'SKU',
                value: 'Product.SKU',
                align: 'start',
            },
            {
                text: 'Mínimo',
                value: 'Min',
            }
        ],
        repuestos: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        employee: null,
   }),
/*var ProductControlSchema = new Schema({
    Min: {type: Number, required: true},
    Product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});*/
    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getcontrolProducts();
        this.getRepuestos();
        
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        async getcontrolProducts() {
            await axios.get(urlAPI + 'productControl')
                .then(res => {
                    let controlProducts = res.data.productControl;
                    if (controlProducts != null) {
                        this.controlProducts = controlProducts.filter(d => d.Status == "ACTIVE");
                    }
                })
        },
        
        async getRepuestos() {
            await axios.get(urlAPI + 'product')
                .then(res => {
                    let products = res.data.product;
                    if (products != null) {
                        this.repuestos = products.filter(d => d.Status == "ACTIVE");
                    }
                })
        },
        
        guardar() {
            if (this.validate()) {
                let auxcontrolProducts = {
                    "productControl": {
                        "Product": this.editedItem.Product,
                        "Min": parseInt(this.editedItem.Min),
                        "Status":"ACTIVE"
                    }
                };
                if (this.nuevo == true) {
                    axios.post(urlAPI + "productControl/add", auxcontrolProducts).then(res => {
                        if (res != null) {
                            this.editedItem = this.defaultItem;
                            this.controlProducts = [];
                            this.getcontrolProducts(this.branchOffice);
                            this.reset();
                        }
                    })

                } else {
                    axios.post(urlAPI + "productControl/" + this.selected[0]._id + "/update", auxcontrolProducts).then(res => {
                        if (res != null) {
                            this.controlProducts = [];
                            this.editedItem = this.defaultItem;
                            this.getcontrolProducts(this.branchOffice);
                            this.reset();
                        }
                    })
                }
            }
        },

        eliminar() {
            axios.post(urlAPI + "productControl/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.controlProducts.splice(this.controlProducts.indexOf(this.selected[0]), 1)
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
            this.editedItem.Product = this.selected[0].Product;
            this.editedItem.Min = this.selected[0].Min;
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

