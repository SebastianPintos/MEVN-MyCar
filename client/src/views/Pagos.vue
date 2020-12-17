<template>
<div v-if="Factura.BranchOffice!=''">

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
                    <v-btn block class="success" @click="comprobarFormCliente();">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn block class="warning" to="/clientes">
                        ¿Cliente no Registrado?
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-form>

    <v-form v-show="aceptoCliente" ref="formPagar" v-model="validPagos" lazy-validation>
        <v-card>
            <v-card-title class="text-center">
                <h2 class="text-center" style="background-color:green;width:100%">Total a Abonar: ${{Factura.Total}}</h2>
            </v-card-title>
            <v-form v-show="aceptoCliente" ref="formTarjeta" v-model="valid" lazy-validation>
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

            <v-form v-show="aceptoCliente" ref="formTransferencia" v-model="valid" lazy-validation>
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

            <v-form v-show="aceptoCliente" ref="formEfectivo" v-model="valid" lazy-validation>
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
            <!--/v-card-text-->

            <v-card-actions>
                <v-btn class="success" block @click="mostrarMsjMontoNoCoincide">
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
                <v-text-field disabled prefix="Se emitirá una Factura: " :value="Factura.Kind"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="detalleFactura=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" @click="detalleFactura=false; dialogDetalle=true">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetalle">
        <v-card>

            <v-card-title>
                <v-flex class="text-center">
                    <h1>Factura: {{Factura.Kind}}</h1>
                </v-flex>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <ol>
                        <li v-for="(elemento,index) in Factura.Elements" :key="index">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field disabled label="Elemento :"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field disabled :value="elemento.Name"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field disabled label="Precio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field disabled :value="elemento.PrecioNeto" prefix="$"></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="elemento.Descuento>0">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.Descuento" suffix="%"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Precio con Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.PrecioConDescuento" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="Factura.Kind=='A'">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Impuestos:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.PrecioConDescuento" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </li>
                    </ol>
                    <div v-if="Factura.Kind!='A'">
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalNeto"></v-text-field>
                            </v-col>
                        </v-row>
                    </div>

                    <div v-else>
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total Neto:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalNeto"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total+IVA:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalImpuesto"></v-text-field>
                            </v-col>
                        </v-row>
                    </div>

                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="dialogDetalle=false;">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" @click="agregarFactura();dialogDetalle=false;">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMensaje" max-width="400px" persistent>
        <v-card>
            <v-card-title>{{tituloMensaje}}</v-card-title>
            <v-card-text>{{mensaje}}</v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2 text-right" @click="aceptarMensaje();">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>

    </v-dialog>

</div>
<div v-else>
    <v-card>
        <h1 class="text-center" width="100%" height="100%">Aún no pertenece a ninguna sucursal!</h1>
    </v-card>
</div>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        detalleFactura: false,
        dialogMensaje: false,
        tituloMensaje: "",
        documentosNacionales: [],
        documentosImportados: [],
        documentosUsados: [],
        pago: false,
        mensaje: "",
        reserva: null,
        clientes: [],
        dialogDetalle: false,
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
        medios: [],
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
                Price: 0,
                Moneda: '',
                CurrencyType: '',
                ExchangeRate: '',

            },
            WireTransfer: {
                Bank: '',
                TransactionNum: '',
                CBU: '',
                Holder: '',
                Price: 0,
                Moneda: '',
                CurrencyType: '',
                ExchangeRate: '',
            },
            Cash: {
                Price: 0,
                Moneda: '',
                CurrencyType: '',
                ExchangeRate: '',
            },
        },
        totalAPagar: 0,
        Factura: {
            Client: "",
            Kind: "",
            Status: "NO PAGADA",
            Elements: [],
            BranchOffice: "",
            PrecioNeto: 0,
            Impuesto: 0,
            NetoRepuestos: 0,
            NetoVStock: 0,
            NetoVEncargados: 0,
            NetoReserva: 0,
            impuestoRepuestos: 0,
            impuestoVStock: 0,
            impuestoReserva: 0,
            impuestoVEncargados: 0,
            TotalNeto: 0,
            Total: 0,
            TotalImpuesto: 0,
        },
        vehiculosStock: [],
        vehiculosSold: [],
        encargados: [],
        vMaestros: [],
        vStock: [],
        repuestos: [],
        requerido: [
            value => !!value || 'Requerido.',
        ],
        employee: null
    }),
    created() {

        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        if (employee != null & employee.BranchOffice != null & employee.BranchOffice != '') {
            this.Factura.BranchOffice = employee.BranchOffice;
            this.employee = employee;
            this.getReserva();
            if (this.reserva != null) {
                this.cliente = this.reserva.Client._id;
                this.aceptoCliente = true;
                this.buscarTipoFactura();

            }
            this.getClientes();
            this.getMonedas();
            this.getVehiculosStock();
            this.getEncargados();
            this.getRepuestos();
            this.getDocumentos();
        }
    },
    methods: {
        getReserva() {
            let reserva = localStorage.getItem("reserva");
            if (reserva != null) {
                this.reserva = JSON.parse(reserva);
            }
        },
        aceptarMensaje() {
            if (this.pago) {
                this.dialogMensaje = false;
                location.href = "/";
                return;
            }
            this.dialogMensaje = false;
        },
        async getClientes() {
            await axios.get(urlAPI + 'client')
                .then(res => {
                    this.clientes = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },

        async getDocumentos() {
            await axios.get(urlAPI + 'documentation')
                .then(res => {
                    let documentation = res.data.documentation.filter(d => d.Status == "ACTIVE");
                    documentation.forEach(d => {
                        let document = {
                            "Documentation": d._id,
                            "Completed": false
                        };
                        if (d.Origin == "IMPORTADO" || d.Origin == "GENERAL") {
                            this.documentosImportados.push(document);
                        } else if (d.Origin == "NACIONAL" || d.Origin == "GENERAL") {
                            this.documentosNacionales.push(document);
                        } else if (d.Origin == "USADO" || d.Origin == "GENERAL") {
                            this.documentosUsados.push(document);
                        }
                    })
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

        mostrarMsjMontoNoCoincide() {
            this.totalAPagar = this.calcularTotalPagos();

            if (this.totalAPagar != this.Factura.Total) {
                this.tituloMensaje = "Monto ingresado inválido";
                this.mensaje = "El total a pagar no coincide con los valores ingresados, debe abonar: " + this.Factura.Total;
                this.dialogMensaje = true;
                this.pago = false;
                return;
            }
            this.detalleFactura = true;

        },

        getClienteAsociado() {
            return this.reserva != null ? this.reserva.Client : this.clientes.find(c => c._id == this.cliente);
        },

        CalcularTipoFactura() {
            /*
            ['AUTÓNOMO','CONSUMIDOR FINAL','EXENTO', 'MONOTRIBUTISTA','RESPONSABLE INSCRIPTO'],
            */

            if (this.$refs.formTarjeta.validate() &
                this.$refs.formTransferencia.validate() &
                this.$refs.formEfectivo.validate()) {
                this.buscarTipoFactura();
            }
        },

        buscarTipoFactura() {
            let cliente = this.getClienteAsociado();
            if (cliente != null) {
                let categoriaFiscal = cliente.TaxCategory;
                if (categoriaFiscal == 'RESPONSABLE INSCRIPTO') {
                    this.Factura.Kind = 'A';
                } else if (categoriaFiscal == 'EXENTO') {
                    this.Factura.Kind = 'E';
                } else {
                    this.Factura.Kind = 'B';
                }
                this.calcularTotal();
            }
        },
        comprobarFormCliente() {
            if (this.$refs.formCliente.validate()) {
                this.aceptoCliente = true;
                this.CalcularTipoFactura();
            }
        },

        calcularTotalPagos() {
            let total = 0;
            if (this.desEfectivo == false) {
                let moneda = this.monedas.filter(m => m._id == this.mediosPago.Cash.Moneda);
                if (moneda != null & moneda.length > 0) {
                    this.mediosPago.Cash.CurrencyType = moneda[0].Name;
                    this.mediosPago.Cash.ExchangeRate = moneda[0].Value;
                    total += moneda[0].Value * this.mediosPago.Cash.Price;
                }
            }
            if (this.desTarjeta == false) {
                let moneda = this.monedas.filter(m => m._id == this.mediosPago.Credicard.Moneda);
                if (moneda != null & moneda.length > 0) {
                    this.mediosPago.Credicard.CurrencyType = moneda[0].Name;
                    this.mediosPago.Credicard.ExchangeRate = moneda[0].Value;
                    total += moneda[0].Value * this.mediosPago.Credicard.Price;
                }
            }
            if (this.desTransferencia == false) {
                let moneda = this.monedas.filter(m => m._id == this.mediosPago.WireTransfer.Moneda);
                if (moneda != null & moneda.length > 0) {
                    this.mediosPago.WireTransfer.CurrencyType = moneda[0].Name;
                    this.mediosPago.WireTransfer.ExchangeRate = moneda[0].Value;
                    total += moneda[0].Value * this.mediosPago.WireTransfer.Price;
                }
            }
            return total;
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
        },

        agregarFactura() {
            //FALTA BRANCHOFFICE
            axios.post(urlAPI + 'factura/add', {
                "factura": {
                    "Client": this.cliente,
                    "Kind": this.Factura.Kind,
                    "Status": this.Factura.Status,
                    "Elements": this.Factura.Elements,
                    "PrecioNeto": this.Factura.TotalNeto,
                    "Impuesto": this.Factura.Impuesto,
                    "BranchOffice": this.Factura.BranchOffice
                }
            }).then(res => {
                if (res != null) {
                    this.agregarPagos(res.data.factura._id);
                }
            });
        },

        getEfectivo() {
            if (this.desEfectivo) {
                return null;
            }
            return {
                "Price": this.mediosPago.Cash.Price,
                "Type": "CASH",
                "CurrencyType": this.mediosPago.Cash.CurrencyType,
                "ExchangeRate": this.mediosPago.Cash.ExchangeRate
            };
        },

        getTarjeta() {
            if (this.desTarjeta) {
                return null;
            }
            return {
                "Price": this.mediosPago.Credicard.Price,
                "Type": "CREDICARD",
                "CurrencyType": this.mediosPago.Credicard.CurrencyType,
                "ExchangeRate": this.mediosPago.Credicard.ExchangeRate,
                "Credicard": {
                    "Company": this.mediosPago.Credicard.Company,
                    "Bank": this.mediosPago.Credicard.Bank,
                    "Name": this.mediosPago.Credicard.Name,
                    "Number": this.mediosPago.Credicard.Number
                },
            }
        },

        getTransferencia() {
            if (this.desTransferencia) {
                return null;
            }
            return {
                "Price": this.mediosPago.WireTransfer.Price,
                "Type": "WIRETRANSFER",
                "CurrencyType": this.mediosPago.WireTransfer.CurrencyType,
                "ExchangeRate": this.mediosPago.WireTransfer.ExchangeRate,
                "WireTransfer": {
                    "Bank": this.mediosPago.WireTransfer.Bank,
                    "TransactionNum": this.mediosPago.WireTransfer.TransactionNum,
                    "CBU": this.mediosPago.WireTransfer.CBU,
                    "Holder": this.mediosPago.WireTransfer.Holder
                }
            }
        },

        agregarMedios() {
            this.medios = [];
            let tarjeta = this.getTarjeta();
            let transferencia = this.getTransferencia();
            let efectivo = this.getEfectivo();
            if (tarjeta != null) {
                this.medios.push(tarjeta);
            };
            if (transferencia != null) {
                this.medios.push(transferencia);
            };
            if (efectivo != null) {
                this.medios.push(efectivo);
            };
        },

        async agregarPagos(idFactura) {
            let repuestos = [];
            this.repuestos.forEach(r => {
                repuestos.push(r._id);
            });
            if (repuestos.length == 0) {
                repuestos = null;
            };

            this.vehiculosStock.forEach(v => {
                this.vehiculosSold.push({
                    "VehicleStock": v,
                    "PurchaseOrderV": null
                });
            });
            if (this.encargados.length > 0) {
                //FALTA AGREGAR SUCURSAL
                this.agregarEncargados(repuestos, idFactura);
            } else {
                this.guardar(repuestos, idFactura);
            }
        },
        getJSONDelivery(vehicle, stock) {
            let documentation;
            if (vehicle.Vehicle.Kind == "USADO") {
                documentation = this.documentosUsados;
            } else if (vehicle.Vehicle.origin == this.employee.Address.Country) {
                documentation = this.documentosNacionales;
            } else {
                documentation = this.documentosImportados;
            }
            documentation = documentation.length == 0 ? null : documentation;
            return {
                "deliveryVehicle": {
                    "Documentation": documentation,
                    "Employee": this.employee._id,
                    "Date": new Date(),
                    "Status": "ACTIVE",
                    "VehicleStock": stock ? vehicle._id : null,
                    "PurchaseOrderV": stock == false ? vehicle._id : null
                }
            }
        },

        async guardar(repuestos, idFactura) {
            this.agregarMedios();
            let cliente = this.getClienteAsociado();
            cliente = cliente.length > 0 ? cliente.CUIT : "";
            let employee = this.employee != null ? this.employee._id : null;
            var idsVehiculos = [];
          
            let cont = 0;
            if (this.vehiculosSold.length > 0) {
                for (let i = 0; i < this.vehiculosSold.length; i++) {
                    if (this.vehiculosSold[i].VehicleStock != null) {
                        await axios.post(urlAPI + 'deliveryVehicle/add', this.getJSONDelivery(this.vehiculosSold[i].VehicleStock, true))
                            .then(res => {
                                if (res != null) {
                                    idsVehiculos[cont] = res.data.deliveryVehicle._id;
                                    cont++;
                                    let estimado = this.calcularEstimado(res.data.deliveryVehicle);
                                    //AGREGAR REMAINDER
                                }
                            });
                    } else if (this.vehiculosSold[i].PurchaseOrderV != null) {
                        await axios.post(urlAPI + 'deliveryVehicle/add', this.getJSONDelivery(this.vehiculosSold[i].PurchaseOrderV, false))
                            .then(res => {
                                if (res != null) {
                                    idsVehiculos[cont] = res.data.deliveryVehicle._id;
                                    cont++;
                                    let estimado = this.calcularEstimado(res.data.deliveryVehicle);
                                    //AGREGAR REMAINDER
                                }
                            });
                    }
                    if (cont == this.vehiculosSold.length) {
                        this.agregarSell(repuestos, idsVehiculos, idFactura, employee, cliente);
                    }
                }
            } else {
                this.agregarSell(repuestos, idsVehiculos, idFactura, employee, cliente);
            }
        },
        agregarSell(repuestos, idsVehiculos, idFactura, employee, cliente) {
            let servicios = [];
            if (this.reserva != null) {
                repuestos = null;
                idsVehiculos = null;
                servicios = this.reserva.Service;
            } else {
                servicios = null;
            }
            let sell = {
                "sell": {
                    "Client": this.cliente,
                    "ProductStock": repuestos,
                    "VehicleSold": idsVehiculos,
                    "PaymentType": this.medios,
                    "Factura": idFactura,
                    "Date": new Date(),
                    "Employee": employee,
                    "CUIT": cliente,
                    "Service": servicios,
                    "BranchOffice": employee.BranchOffice
                }
            };

            if (this.reserva == null) {
                this.venderVehiculo(sell);
            } else {
                this.venderServicio(sell);
            }
        },

        venderVehiculo(sell) {
            axios.post(urlAPI + 'sellVehicle/add', sell)
                .then(
                    res => {
                        if (res != null)
                            this.resetItems();
                    }
                );
        },
        venderServicio(sell) {
            axios.post(urlAPI + 'sell/reservation', sell)
                .then(
                    res => {
                        if (res != null)
                            axios.delete(urlAPI + 'reservation/' + this.reserva._id + '/delete').then(res => {
                                if (res != null) {
                                    this.resetItems();
                                }
                            });
                    });
        },
        resetItems() {
            this.tituloMensaje = "Operación exitosa";
            this.mensaje = "Compra realizada con éxito";
            this.dialogMensaje = true;
            this.pago = true;
            for (let i = 0; i < this.encargados.length; i++) {
                let item = JSON.parse(localStorage.getItem("vM" + i));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = 0;
                    localStorage.setItem(String("vM" + i), JSON.stringify(item));
                }
            }
            for (let i = 0; i < this.vehiculosStock.length; i++) {
                let item = JSON.parse(localStorage.getItem("v" + i));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = 0;
                    localStorage.setItem(String("v" + i), JSON.stringify(item));
                }
            }
            for (let i = 0; i < this.repuestos.length; i++) {
                let item = JSON.parse(localStorage.getItem("r" + i));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = 0;
                    localStorage.setItem(String("r" + i), JSON.stringify(item));
                }
            }
            localStorage.removeItem("reserva");
        },
        async agregarEncargados(repuestos, idFactura) {
            for (let i = 0; i < this.encargados.length; i++) {
                await axios.post(urlAPI + 'purchaseOrderV/add', {
                    "purchaseOrderV": {
                        "OrderDate": new Date(),
                        "Price": this.encargados[i].SuggestedPrice,
                        "Venta": true,
                        "Vehicle": [{
                            "ChasisNum": "0",
                            "EngineNum": "0",
                            "Color": this.encargados[i].Color,
                            "VehicleID": this.encargados[i]._id,
                            "Price": this.encargados[i].SuggestedPrice
                        }],
                        "Dealer": this.encargados[i].Dealer,
                        "BranchOffice": this.encargados[i].BranchOffice,
                        "Status": "ACTIVE",
                        "Type": "RECIBIDA",
                        "Employee": this.employee._id
                    }
                }).then(res => {
                    if (res != null) {
                        this.vehiculosSold.push({
                            "PurchaseOrderV": res.data.purchaseOrderV,
                            "VehicleStock": null
                        });
                    }
                    if (i == this.encargados.length - 1) {
                        this.guardar(repuestos, idFactura);
                    }
                });
            }
        },

        getVehiculosStock() {
            let length = 0;
            this.vehiculoStock = [];
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthv")));
            } catch (e) {
                return;
            }
            for (let i = 0; i < length; i++) {
                let vehiculoStock = JSON.parse(localStorage.getItem(String("v" + i)));
                if (vehiculoStock != null && vehiculoStock.carrito) {
                    this.vehiculosStock.push(vehiculoStock);
                }
            }
        },

        getEncargados() {
            let length = 0;
            this.encargados = [];
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthvM")));
            } catch (e) {
                return;
            }
            for (let i = 0; i < length; i++) {
                let encargado = JSON.parse(localStorage.getItem(String("vM" + i)));
                if (encargado != null && encargado.carrito) {
                    this.encargados.push(encargado);
                }
            }
        },

        getRepuestos() {
            let length = 0;
            this.repuestos = [];
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthr")));
            } catch (e) {
                return;
            }
            for (let i = 0; i < length; i++) {
                let repuesto = JSON.parse(localStorage.getItem(String("r" + i)));
                if (repuesto != null && repuesto.carrito) {
                    this.repuestos.push(repuesto);
                }
            }
        },

        calcularTotal() {
            this.vehiculosStock.forEach(v => {
                let precioNeto = 0.0;
                let impuesto = 0.0;
                let descuento = 0.0;
                let descontado = 0.0;
                let precio = 0.0;
                let nombre = v.Vehicle.Brand + " " + v.Vehicle.Model +
                    " " + v.Vehicle.year + " " + v.Vehicle.Type +
                    " " + v.Vehicle.Kind + " " + v.Color;
                if (v.PurchasedPrice != null) {
                    if (v.descontado > 0) {
                        descuento = v.descuento;
                        descontado = v.descontado;
                        precio = descontado;
                    } else {
                        precio = v.PurchasedPrice;
                    }
                }
                //SI ES FACTURA A =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                //IMPUESTOS: PRECIO NETO + 21% 
                if (this.Factura.Kind == "A") {
                    precioNeto = precio;
                    impuesto = precio + (21 * precio / 100);
                    this.Factura.NetoVStock += precioNeto;
                    this.Factura.impuestoVStock += impuesto;
                    this.Factura.TotalNeto += precioNeto;
                    this.Factura.TotalImpuesto += impuesto;
                }

                //SI ES FACTURA B =>  PRECIO NETO ES EL PRECIO + 21%
                else if (this.Factura.Kind == "B") {
                    precioNeto = precio + (21 * precio / 100);
                    this.Factura.NetoVStock += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                //SI ES FACTURA E =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                else {
                    precioNeto = precio;
                    this.Factura.NetoVStock += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                this.Factura.Elements.push({
                    "Name": nombre,
                    "PrecioNeto": precioNeto,
                    "Impuesto": impuesto,
                    "Descuento": descuento,
                    "PrecioConDescuento": descontado
                })
            });

            if (this.reserva != null) {
                this.reserva.Service.forEach(v => {
                    let precioNeto = 0.0;
                    let impuesto = 0.0;
                    let descuento = 0.0;
                    let descontado = 0.0;
                    let precio = v.LaborPrice;
                    v.Product.forEach(p => {
                        precio += p.SalePrice;
                    })
                    let nombre = v.Description + " Precio: " + precio;

                    //SI ES FACTURA A =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                    //IMPUESTOS: PRECIO NETO + 21% 
                    if (this.Factura.Kind == "A") {
                        precioNeto = precio;
                        impuesto = precio + (21 * precio / 100);
                        this.Factura.NetoReserva += precioNeto;
                        this.Factura.impuestoReserva += impuesto;
                        this.Factura.TotalNeto += precioNeto;
                        this.Factura.TotalImpuesto += impuesto;
                    }

                    //SI ES FACTURA B =>  PRECIO NETO ES EL PRECIO + 21%
                    else if (this.Factura.Kind == "B") {
                        precioNeto = precio + (21 * precio / 100);
                        this.Factura.NetoReserva += precioNeto;
                        this.Factura.TotalNeto += precioNeto;
                    }

                    //SI ES FACTURA E =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                    else {
                        precioNeto = precio;
                        this.Factura.NetoReserva += precioNeto;
                        this.Factura.TotalNeto += precioNeto;
                    }

                    this.Factura.Elements.push({
                        "Name": nombre,
                        "PrecioNeto": precioNeto,
                        "Impuesto": impuesto,
                        "Descuento": descuento,
                        "PrecioConDescuento": descontado
                    })
                });
            }

            this.repuestos.forEach(r => {
                let precioNeto = 0.0;
                let impuesto = 0.0;
                let descuento = 0.0;
                let descontado = 0.0;
                let precio = 0.0;
                let nombre = r.Product.Brand + " " + r.Product.Category +
                    " " + r.Product.SubCategory;
                if (r.Price != null) {
                    if (r.descontado > 0) {
                        descuento = r.descuento;
                        descontado = r.descontado;
                        precio = descontado;
                    } else {
                        precio = r.Price;
                    }
                }
                //SI ES FACTURA A =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                //IMPUESTOS: PRECIO NETO + 21% 
                if (this.Factura.Kind == "A") {
                    precioNeto = precio;
                    impuesto = precio + (21 * precio / 100);
                    this.Factura.NetoRepuestos += precioNeto;
                    this.Factura.impuestoRepuestos += impuesto;
                    this.Factura.TotalNeto += precioNeto;
                    this.Factura.TotalImpuesto += impuesto;
                }

                //SI ES FACTURA B =>  PRECIO NETO ES EL PRECIO + 21%
                else if (this.Factura.Kind == "B") {
                    precioNeto = precio + (21 * precio / 100);
                    this.Factura.NetoRepuestos += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                //SI ES FACTURA E =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                else {
                    precioNeto = precio;
                    this.Factura.NetoRepuestos += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                this.Factura.Elements.push({
                    "Name": nombre,
                    "PrecioNeto": precioNeto,
                    "Impuesto": impuesto,
                    "Descuento": descuento,
                    "PrecioConDescuento": descontado
                })
            });

            this.encargados.forEach(r => {
                let precioNeto = 0.0;
                let impuesto = 0.0;
                let descuento = 0.0;
                let descontado = 0.0;
                let precio = 0.0;
                let nombre = r.Brand + " " + r.Model +
                    " " + r.year + " " + r.Type + " " + r.Category;
                if (r.SuggestedPrice != null) {
                    if (r.descontado > 0) {
                        descuento = r.descuento;
                        descontado = r.descontado;
                        precio = descontado;
                    } else {
                        precio = r.SuggestedPrice;
                    }
                }
                //SI ES FACTURA A =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                //IMPUESTOS: PRECIO NETO + 21% 
                if (this.Factura.Kind == "A") {
                    precioNeto = precio;
                    impuesto = precio + (21 * precio / 100);
                    this.Factura.NetoVEncargados += precioNeto;
                    this.Factura.impuestoVEncargados += impuesto;
                    this.Factura.TotalNeto += precioNeto;
                    this.Factura.TotalImpuesto += impuesto;
                }

                //SI ES FACTURA B =>  PRECIO NETO ES EL PRECIO + 21%
                else if (this.Factura.Kind == "B") {
                    precioNeto = precio + (21 * precio / 100);
                    this.Factura.NetoVEncargados += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                //SI ES FACTURA E =>  PRECIO NETO ES EL PRECIO SIN IMPUESTOS
                else {
                    precioNeto = precio;
                    this.Factura.NetoVEncargados += precioNeto;
                    this.Factura.TotalNeto += precioNeto;
                }

                this.Factura.Elements.push({
                    "Name": nombre,
                    "PrecioNeto": precioNeto,
                    "Impuesto": impuesto,
                    "Descuento": descuento,
                    "PrecioConDescuento": descontado
                })
            });

            if (this.Factura.Kind == 'A') {
                this.Factura.TotalImpuesto = this.Factura.impuestoRepuestos +
                    this.Factura.impuestoVEncargados +
                    this.Factura.impuestoVStock + this.Factura.impuestoReserva;
                this.Factura.Total = this.Factura.TotalImpuesto;
            } else {
                this.Factura.Total = this.Factura.TotalNeto;
            }
        },

        reiniciarFactura() {
            this.Factura.Elements = [];
            this.Factura.PrecioNeto = 0;
            this.Factura.Impuesto = 0;
            this.Factura.NetoRepuestos = 0;
            this.Factura.NetoVStock = 0;
            this.Factura.NetoVEncargados = 0;
            this.Factura.impuestoRepuestos = 0;
            this.Factura.impuestoVEncargados = 0;
            this.Factura.impuestoVStock = 0;
            this.Factura.TotalNeto = 0;
            this.Factura.TotalImpuesto = 0;
        },

        vender() {
            this.mostrarMsjMontoNoCoincide();
        },

        calcularEstimado(delivery) {
            let documentos = this.getDocumentosObligatorios(delivery.Documentation);
            if (documentos.length > 0) {
                let date = new Date(delivery.Date);
                let max = 0;
                for (let i = 0; i < documentos.length; i++) {
                    if (documentos[i].DocumentationID.EstimatedTime > max) {
                        max = documentos[i].DocumentationID.EstimatedTime;
                    }
                }
                return new Date(date.setDate(date.getDate() + max));
            }
            return 0;
        },

        getDocumentosObligatorios(documentos) {
            let ret = [];
            if (documentos != null) {
                documentos.forEach(d => {
                    if (d.DocumentationID != null) {
                        ret.push(d);
                    }
                })
            }
            return ret;
        },
    }
};
</script>
