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
                    <v-btn block class="success" @click="aceptoCliente=true">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn block class="warning" to="/clientes">
                        ¿Cliente no Registrado?
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-form>

    <v-form v-if="aceptoCliente" ref="formPagar">
        <v-card>

            <v-form v-if="aceptoCliente" ref="formTarjeta" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Tarjeta</h2>
                        <v-btn icon rigth @click="editarTarjeta">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" prefix="$" label="Monto" :disabled="desTarjeta"></v-text-field>
                        <v-select label="Moneda" :disabled="desTarjeta" :items="monedas"></v-select>
                        <v-select label="Compañía" :disabled="desTarjeta" :items="tarjetas"></v-select>
                        <v-text-field label="Banco" :disabled="desTarjeta"></v-text-field>
                        <v-text-field label="Nombre del Titular" :disabled="desTarjeta"></v-text-field>
                        <v-text-field type="number" label="Código de la operación" :disabled="desTarjeta"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-form>

            <v-form v-if="aceptoCliente" ref="formTransferencia" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Transferencia</h2>
                        <v-btn icon right @click="editarTransferencia">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" label="Monto" prefix="$" :disabled="desTransferencia"></v-text-field>
                        <v-select label="Moneda" :disabled="desTransferencia" :items="monedas"></v-select>
                        <v-select label="Banco" :disabled="desTransferencia" :items="bancos"></v-select>
                        <v-text-field type="number" label="N° de Transacción" :disabled="desTransferencia"></v-text-field>
                        <v-text-field type="number" label="CBU" :disabled="desTransferencia"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-form>

            <v-form v-if="aceptoCliente" ref="formEfectivo" v-model="valid" lazy-validation>
                <v-card>
                    <v-card-title>
                        <h2>Efectivo</h2>
                        <v-btn icon rigth @click="editarEfectivo">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field type="number" prefix="$" label="Monto" :disabled="desEfectivo"></v-text-field>
                        <v-select label="Moneda" :disabled="desEfectivo" :items="monedas"></v-select>
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
                <v-text-field disabled value="Se emitirá una factura A"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn class="info">
                    <v-icon>mdi-cancel</v-icon>
                </v-btn>
                <v-btn class="info">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
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
        dias: [],
        detalleFactura: false,
        horas: [],
        clientes: [],
        tarjetas: ["American Express", "Visa", "MasterCard"],
        bancos: ["ICBC", "HCBC", "Banco Provincia", "Santander Río"],
        monedas: ["ARS", "EUR", "USD"],
        cliente: null,
        aceptoCliente: false,
        valid: true,
        desTarjeta: true,
        desTransferencia: true,
        desEfectivo: true,

        numeroRequerido: [
            value => {
                const pattern = /^[0-9]$/
                return pattern.test(value) || 'Requerido.'
            },
        ],

        mediosPago: {
            Credicard: {

            },
            WireTransfer: {

            },
            Cash: {

            }
        },

        requerido: [
            value => !!value || 'Requerido.',
        ],
    }),
    created() {
        this.getClientes();
    },
    methods: {
        async getClientes() {
            await axios.get(urlAPI + 'client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
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
            this.detalleFactura=true;
        },
    },
}
</script>
