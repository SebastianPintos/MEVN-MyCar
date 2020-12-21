<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="repuestos" :search="search" item-key="_idTabla" class="elevation-1">
        <template v-slot:item.BatchNum="{ item }">
            {{ format(item.BatchNum) }}
        </template>
        <template v-slot:item.Expiration="{ item }">
            {{ formatDate(item.Expiration) }}
        </template>
        <template v-slot:item.Product.SalePrice="{ item }">
            {{ formatPrice(item.Product.SalePrice) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <div v-if="caja=='ABIERTA'">
                <v-btn v-if="item.carrito == false" fab small color="success"  @click="agregarAlCarrito(item)">
                    <v-icon class="text-center">
                        mdi-cart-plus</v-icon>
                </v-btn>
                <v-btn v-else fab small color="error" @click="eliminarDelCarrito(item)">
                    <v-icon class="text-center" >
                        mdi-cart-remove</v-icon>
                </v-btn>
            </div>
        </template>
    </v-data-table>
    <v-dialog v-model="dialogCantidad" persistent max-width="600">
        <v-card class="mx-auto" max-width="600">
            <v-flex class="text-center">
                <v-card-title>Cantidad</v-card-title>
            </v-flex>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <v-col class="text-center">
                        <span class="display-3 font-weight-light" v-text="cantidad"></span></v-col>
                    <v-slider v-model="cantidad" class="slide" color="orange" track-color="grey" always-dirty min="1" :max="max">
                        <template v-slot:prepend>
                            <v-icon color="blue" @click="decrement">
                                mdi-minus
                            </v-icon>
                        </template>

                        <template v-slot:append>
                            <v-icon color="blue" @click="increment">
                                mdi-plus
                            </v-icon>
                        </template>
                    </v-slider>
                    <v-text-field type="number" v-model="descuento" suffix="%" label="Descuento" :rules="requerido"></v-text-field>

                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info mb-2" @click="cancelarCantidad">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info mb-2" @click="confirmarElemento">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-form>
        </v-card>

    </v-dialog>
</div>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        selected: [],
        descuento: 0,
        descontado: 0,
        caja: 'CERRADA',
        singleSelect: true,
        repuestos: [],
        repuestosFiltrados: [],
        search: '',
        on: '',
        valid: true,
        ultimoEnCarrito: null,
        attrs: '',
        max: 0,
        employee: null,
        cantidad: 0,
        dialogCantidad: false,
        headers: [{
                text: 'Marca',
                value: 'Product.Brand',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Categoría',
                value: 'Product.Category',
            },

            {
                text: 'Sub-categoría',
                value: 'Product.SubCategory',
            },
            {
                text: 'N° Lote',
                value: 'BatchNum',
            },

            {
                text: 'Vto',
                value: 'Expiration',
            },

            {
                text: 'Precio',
                value: 'Product.SalePrice',
                align: 'right'
            },

            {
                text: 'Disponibles',
                value: 'Available',
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],
        requerido: [
            value => {
                const pattern = /^[0-9]{1,}([,]{1}[0-9]{1,}){0,1}([.]{1}[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Requerido.'
            },
            value => parseFloat(value) < 100 || 'El máximo es 100%!'
        ],
    }),

    created() {
        let employee = localStorage.getItem("employee");
        if (employee != null) {
            this.employee = JSON.parse(employee);
            this.iniciar();
        }

    },
    methods: {

       getCaja() {
            axios.get(urlAPI + 'branchOffice').then(res => {
                if (res != null) {
                    let branchOffice = res.data.branchOffice;
                    branchOffice = branchOffice.find(b => b._id == this.employee.BranchOffice);
                    if (branchOffice != null) {
                        if(branchOffice.Caja==null){
                            this.caja="CERRADA";
                        }
                        else{
                            if(branchOffice.Caja.Estado==null){
                                this.caja="CERRADA";
                            }
                            else{
                                  this.caja = branchOffice.Caja.Estado;
                            }
                        }
                  }
                }
            })
        },
        cancelarCantidad() {
            this.eliminarDelCarrito(this.ultimoEnCarrito);
            this.dialogCantidad = false;
        },
        decrement() {
            this.cantidad--
        },
        increment() {
            this.cantidad++
        },
        iniciar() {
            this.getRepuestos();
            this.getCaja();
        },

        async getRepuestos() {
            let repuestos = [];
            let repuestoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "productStock")
                .then(res => {
                    repuestos = res.data.productStock.filter(v => v.Status === "ACTIVE");
                    if (this.employee != null & this.employee.BranchOffice != null) {
                    repuestos = repuestos.filter(r => r.BranchOffice!=null && r.BranchOffice._id == this.employee.BranchOffice);
                    }

                    if (repuestos != null) {
                        for (let i = 0; i < repuestos.length; i++) {
                            let item = JSON.parse(localStorage.getItem(String("r" + i)));
                            let disponibles = repuestos[i].Available != null ? repuestos[i].Available : 0;
                            if (disponibles > 0) {
                                let carrito = false;
                                let descuento = 0;
                                let descontado = 0;
                                let cantidad = 0;

                                if (item != null && item.carrito != null) {
                                    carrito = item.carrito;
                                }

                                if (item != null && item.descontado != null) {
                                    descontado = item.descontado;
                                }
                                if (item != null && item.descuento != null) {
                                    descuento = item.descuento;
                                }
                                if (item != null && item.cantidad != null) {
                                    cantidad = item.cantidad;
                                }

                                repuestoAGuardar = {
                                    "_id": repuestos[i]._id,
                                    "BatchNum": repuestos[i].BatchNum,
                                    "Available": repuestos[i].Available,
                                    "Expiration": repuestos[i].Expiration,
                                    "Product": repuestos[i].Product,
                                    "BranchOffice": repuestos[i].BranchOffice,
                                    "Status": repuestos[i].Status,
                                    "Price": repuestos[i].Product.SalePrice,
                                    "carrito": carrito,
                                    "descuento": descuento,
                                    "cantidad": cantidad,
                                    "descontado": descontado
                                };
                                this.repuestos.push(repuestoAGuardar);
                                this.repuestosFiltrados.push(repuestoAGuardar);
                                localStorage.setItem(String("r" + cont), JSON.stringify(repuestoAGuardar));
                                cont++;
                            }
                        }
                    }
                    localStorage.setItem("lengthr", cont);
                });
        },
        agregarAlCarrito(item) {
            this.ultimoEnCarrito = item;
            this.max = item.Available;
            this.dialogCantidad = true;
            let seleccionado = this.repuestos.indexOf(item);
            if (seleccionado != -1) {
                this.repuestos[seleccionado].carrito = true;
                let item = JSON.parse(localStorage.getItem(String("r" + seleccionado)));
                if (item != null) {
                    item.carrito = true;
                    localStorage.setItem(String("r" + seleccionado), JSON.stringify(item));
                }
            }
        },
        eliminarDelCarrito(item) {
            let seleccionado = this.repuestos.indexOf(item);
            if (seleccionado != -1) {
                this.repuestos[seleccionado].carrito = false;
                let item = JSON.parse(localStorage.getItem("r" + String(seleccionado)));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = this.descuento;
                    localStorage.setItem(String("r" + seleccionado), JSON.stringify(item));
                }
            }
        },
        confirmarElemento() {
            if (this.$refs.form.validate()) {
                let index = this.repuestos.indexOf(this.ultimoEnCarrito);
                if (index != -1) {
                    let item = JSON.parse(localStorage.getItem("r" + String(index)));
                    if (item != null) {
                        item.descuento = this.descuento;
                        item.cantidad = this.cantidad;
                        let valorDescuento = (item.Price * this.descuento) / 100;
                        item.descontado = item.Price - valorDescuento;
                        localStorage.setItem(String("r" + String(index)), JSON.stringify(item));
                    }

                }
                this.descuento = 0;
                this.descontado = 0;
                this.dialogCantidad = false;
                this.cantidad = 0;
            }
        },

        format(value) {
            return value == null ? "S/D" : String(value);
        },
        formatDate(value) {
            if (value == null) {
                return "N/A";
            }
            value = String(value);
            value = value.slice(0, 10);
            return value;
        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
    },

}
</script>

<style>
.slide {
    touch-action: none;
}
</style>
