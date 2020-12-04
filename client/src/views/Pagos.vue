<template>
<div>

    <v-form v-if="aceptoCliente==false" ref="formCliente" v-model="valid" lazy-validation>
        <v-card>
            <v-card-title>
                <h2>Elige el Cliente para Continuar</h2>
            </v-card-title>
            <v-card-text>
                <v-select label="ID del Cliente" :items="clientes" v-model="cliente" item-text="DNI" item-value="_id" :rules="requerido">
                    <template slot="item" slot-scope="data">
                        {{ data.item.DNI }} - {{ data.item.Name }} {{ data.item.LastName }}
                    </template>
                </v-select>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn block class="success" @click="comprobarFormCliente">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn block class="warning" to="/clientes">
                        ¿Cliente no Registrado?
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-form>

    <v-form v-if="aceptoCliente" ref="formPagar" v-model="validPagos" lazy-validation>
        <v-card>

            <v-form v-if="aceptoCliente" ref="formTarjeta" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Tarjeta</h2>
                        <v-btn icon rigth @click="editarTarjeta();modificarReglasTarjeta()">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" prefix="$" label="Monto" :disabled="desTarjeta" v-model="mediosPago.Credicard.Price" :rules="reglaPrecioTarjeta"></v-text-field>
                        <v-select label="Moneda" :disabled="desTarjeta" :items="monedas" item-text="Name" item-value="_id" v-model="mediosPago.Credicard.Moneda" :rules="reglaTarjeta">
                            <template slot="item" slot-scope="data">
                                {{ data.item.Name }} - ${{ data.item.Value }}
                            </template>
                        </v-select>
                        <v-select label="Compañía" :disabled="desTarjeta" :items="tarjetas" v-model="mediosPago.Credicard.Company" :rules="reglaTarjeta"></v-select>
                        <v-text-field label="Banco" :disabled="desTarjeta" v-model="mediosPago.Credicard.Bank"></v-text-field>
                        <v-text-field label="Nombre del Titular" :disabled="desTarjeta" v-model="mediosPago.Credicard.Name" :rules="reglaTarjeta"></v-text-field>
                        <v-text-field type="number" label="Código de la operación" :disabled="desTarjeta" v-model="mediosPago.Credicard.Number" :rules="reglaNumeroTarjeta"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-form>

            <v-form v-if="aceptoCliente" ref="formTransferencia" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Transferencia</h2>
                        <v-btn icon right @click="editarTransferencia();modificarReglasTransferencia()">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" label="Monto" prefix="$" :disabled="desTransferencia" v-model="mediosPago.WireTransfer.Price" :rules="reglaPrecioTransferencia"></v-text-field>
                        <v-select label="Moneda" :disabled="desTransferencia" :items="monedas" item-text="Name" item-value="_id" v-model="mediosPago.WireTransfer.Moneda" :rules="reglaTransferencia">
                            <template slot="item" slot-scope="data">
                                {{ data.item.Name }} - ${{ data.item.Value }}
                            </template>
                        </v-select>
                        <v-select label="Banco" :disabled="desTransferencia" :items="bancos" v-model="mediosPago.WireTransfer.Bank" :rules="reglaTransferencia"></v-select>
                        <v-text-field type="number" label="N° de Transacción" :disabled="desTransferencia" v-model="mediosPago.WireTransfer.TransactionNum" :rules="reglaNumeroTransferencia"></v-text-field>
                        <v-text-field type="number" label="CBU" :disabled="desTransferencia" v-model="mediosPago.WireTransfer.CBU" :rules="reglaNumeroTransferencia"></v-text-field>
                        <v-text-field label="Titular" :disabled="desTransferencia" v-model="mediosPago.WireTransfer.Holder" :rules="reglaTransferencia"></v-text-field>

                    </v-card-text>
                </v-card>
            </v-form>

            <v-form v-if="aceptoCliente" ref="formEfectivo" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Efectivo</h2>
                        <v-btn icon rigth @click="editarEfectivo();modificarReglasEfectivo()">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" prefix="$" label="Monto" :disabled="desEfectivo" v-model="mediosPago.Cash.Price" :rules="reglaPrecioEfectivo"></v-text-field>
                        <v-select label="Moneda" :disabled="desEfectivo" :items="monedas" item-text="Name" item-value="_id" v-model="mediosPago.Cash.Moneda" :rules="reglaEfectivo">
                            <template slot="item" slot-scope="data">
                                {{ data.item.Name }} - ${{ data.item.Value }}
                            </template>
                        </v-select>
                    </v-card-text>
                </v-card>
            </v-form>

            </v-card-text>
            <v-card-actions>
                <v-btn class="success" block @click="mostrarDetalleFactura">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
    <v-dialog v-model="detalleFactura" persistent>
        <v-card>
            <v-card-title>
                <h2>Confirmación</h2>
            </v-card-title>
            <v-card-text>
                <v-text-field disabled prefix="Se emitirá una Factura: " :value="kind"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="detalleFactura=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        detalleFactura: false,
        clientes: [],
        tarjetas: ["American Express", "Visa", "MasterCard"],
        bancos: ["ICBC", "HCBC", "Banco Provincia", "Santander Río"],
        monedas: [],
        cliente: null,
        aceptoCliente: false,
        validPagos: true,
        valid: true,
        desTarjeta: true,
        desTransferencia: true,
        desEfectivo: true,
        reglaTarjeta: [],
        reglaPrecioTarjeta: [],
        reglaNumeroTarjeta: [],

        reglaTransferencia: [],
        reglaPrecioTransferencia: [],
        reglaNumeroTransferencia: [],

        reglaEfectivo: [],
        reglaPrecioEfectivo: [],

        numeroRequerido: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Requerido.'
            },
        ],
        precioRequerido: [
            value => {
                const pattern = /^[0-9]{1,}([,]{1}[0-9]{1,}){0,1}([.]{1}[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Requerido.'
            },
        ],

        //CurrencyType y ExchangeRate -Moneda
        mediosPago: {
            Credicard: {
                Company: '',
                Bank: '',
                Name: '',
                Number: '',
                Price: '',
                Moneda: '',

            },
            WireTransfer: {
                Bank: '',
                TransactionNum: '',
                CBU: '',
                Holder: '',
                Price: '',
                Moneda: '',
            },
            Cash: {
                Price: '',
                Moneda: '',
            }
        },

        kind: '',

        requerido: [
            value => !!value || 'Requerido.',
        ],
    }),
    created() {
        this.getClientes();
        this.getMonedas();
    },
    methods: {
        async getClientes() {
            await axios.get(urlAPI + 'client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },

        async getMonedas() {
            await axios.get(urlAPI + 'monedas')
                .then(res => {
                    this.monedas = res.data.monedas.filter(m => m.Status === "ACTIVE")
                });
        },
        editarTarjeta() {
            this.desTarjeta = !this.desTarjeta;
        },
        editarTransferencia() {
            this.desTransferencia = !this.desTransferencia;
        },
        editarEfectivo() {
            this.desEfectivo = !this.desEfectivo;
        },
        mostrarDetalleFactura() {
            /*
            ['AUTÓNOMO','CONSUMIDOR FINAL','EXENTO', 'MONOTRIBUTISTA','RESPONSABLE INSCRIPTO'],
            */
            if (this.$refs.formTarjeta.validate() &
                this.$refs.formTransferencia.validate() &
                this.$refs.formEfectivo.validate()) {
                let categoriaFiscal = this.cliente.TaxtCategory;
                if (categoriaFiscal == 'RESPONSABLE INSCRIPTO') {
                    this.kind = 'A';
                }
                if (categoriaFiscal == 'EXENTO') {
                    this.kind = 'E';
                } else {
                    this.kind = 'B';
                }
                
                this.detalleFactura = true;
            } 
        },
        comprobarFormCliente() {
            if (this.$refs.formCliente.validate()) {
                this.aceptoCliente = true;
            }
        },
        modificarReglasTarjeta() {
            if (!this.desTarjeta) {
                this.reglaTarjeta = this.requerido;
                this.reglaNumeroTarjeta = this.numeroRequerido;
                this.reglaPrecioTarjeta = this.precioRequerido;
            } else {
                this.reglaNumeroTarjeta = [];
                this.reglaTarjeta = [];
                this.reglaPrecioTarjeta = [];
            }
        },
        modificarReglasTransferencia() {
            if (!this.desTransferencia) {
                this.reglaTransferencia = this.requerido;
                this.reglaNumeroTransferencia = this.numeroRequerido;
                this.reglaPrecioTransferencia = this.precioRequerido;
            } else {
                this.reglaNumeroTransferencia = [];
                this.reglaTransferencia = [];
                this.reglaPrecioTransferencia = [];
            }

        },

        modificarReglasEfectivo() {
            if (!this.desEfectivo) {
                this.reglaEfectivo = this.requerido;
                this.reglaPrecioEfectivo = this.precioRequerido;
            } else {
                this.reglaEfectivo = [];
                this.reglaPrecioEfectivo = [];
            }
        }
    },
}
</script>
