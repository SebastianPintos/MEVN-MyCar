<template>
<div>
    <v-tabs background-color="#2764c4" tile dark grow>
        <v-tab @click="vistaVehiculos = true; vistaRepuestos = false; ventasRealizadas=false">Vehículos</v-tab>
        <v-tab @click=" vistaVehiculos = false; vistaRepuestos = true;ventasRealizadas=false">Repuestos</v-tab>
        <v-tab @click=" vistaVehiculos = false; vistaRepuestos = false;ventasRealizadas=true">Ventas Realizadas</v-tab>
        <v-btn color="#00ced1" style="height: 100%" @click="mostrarCarrito">
            <v-icon>mdi-cart-outline</v-icon>
        </v-btn>
    </v-tabs>

    <VentaVehiculos v-show="vistaVehiculos" />
    <VentaRepuestos v-show="vistaRepuestos" />
    <VentasRealizadas v-show="ventasRealizadas" />


    <v-dialog v-model="dialogDetalle" persistent>
        <v-card>
            <v-flex class="text-center">
                <v-card-title>Detalle del Carrito</v-card-title>
            </v-flex>
            <v-card-text>
                <v-container>
                    <ol v-if="vehiculos!= null || repuestos!=null">
                        <h3 v-if="vehiculos.length>0">Vehículos Stock: </h3>
                        <li v-for="(vehiculo,index) in vehiculos" :key="index">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Marca:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Vehicle.Brand"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Modelo:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Vehicle.Model"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Año:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Vehicle.year"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                            <div v-if="vehiculo.Domain!=null & vehiculo.Domain!=''">
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Dominio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Domain"></v-text-field>
                                </v-col>
                            </div>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Color:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Color"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Precio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.PurchasedPrice" prefix="$"></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="vehiculo.descuento>0">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="vehiculo.descuento" suffix="%"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Precio con Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="vehiculo.descontado" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </li>
                    </ol>

                    
                        <h3 v-if="encargados.length>0">Vehículos Encargados: </h3>
                        <li v-for="(vehiculo,index) in encargados" :key="index">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Marca:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Brand"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Modelo:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Model"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Año:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.year"></v-text-field>
                                </v-col>
                            </v-row>

                           
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Color:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.Color"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Precio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="vehiculo.SuggestedPrice" prefix="$"></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="vehiculo.descuento>0">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="vehiculo.descuento" suffix="%"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Precio con Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="vehiculo.descontado" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </li>
                    

                    <ol>
                
                        <h3 v-if="repuestos.length>0">Repuestos: </h3>
                        <li v-for="(repuesto,index) in repuestos" :key="index">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Marca:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="repuesto.Product.Brand"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Categoría:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="repuesto.Product.Category"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row v-if="repuesto.Product.SubCategory!=null">
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Sub-Categoría:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="repuesto.Product.SubCategory"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Precio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="repuesto.Price" prefix="$"></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="repuesto.descuento>0">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="repuesto.descuento" suffix="%"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field readonly value="Precio con Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field readonly :value="repuesto.descontado" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field readonly value="Cantidad:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field readonly :value="repuesto.cantidad"></v-text-field>
                                </v-col>
                            </v-row>

                        </li>
                    </ol>
                    <v-row>
                        <v-col cols="12" md="6">
                            <strong>
                                <v-text-field readonly value="Total:"></v-text-field>
                            </strong>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field readonly prefix="$" :value="total"></v-text-field>
                        </v-col>
                    </v-row>

                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="dialogDetalle=false;total=0">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" :to="'/pagos'">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
import VentaRepuestos from '@/components/VentaRepuestos.vue';
import VentaVehiculos from '@/components/VentaVehiculos.vue';
import VentasRealizadas from '@/views/VentasRealizadas.vue';

export default {
    data: () => ({
        total: 0,
        vistaVehiculos: true,
        vistaRepuestos: false,
        dialogDetalle: false,
        ventasRealizadas: false,
        carritoCompleto: {
            repuestosCarrito: [],
            vehiculosCarrito: [],
            totalRepuestos: 0,
            totalVehiculos: 0,
            total: 0
        },
        
        carritoCompletoD: {
            repuestosCarrito: [],
            vehiculosCarrito: [],
            totalRepuestos: 0,
            totalVehiculos: 0,
            total: 0
        },
        vehiculos: [],
        encargados: [],
        repuestos: []
    }),
    components: {
        VentaVehiculos,
        VentaRepuestos,
        VentasRealizadas
    },
    methods: {
        getVehiculos() {
            this.vehiculos = [];
            let length = 0;
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthv")));
            } catch (e) {
                return;
            }
            //length++;
            for (let i = 0; i < length; i++) {
                let vehiculo = JSON.parse(localStorage.getItem(String("v" + i)));
                if (vehiculo != null && vehiculo.carrito) {
                    this.vehiculos.push(vehiculo);
                }
            }
        },


        getEncargados() {
            this.encargados = [];
            let length = 0;
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthvM")));
            } catch (e) {
                return;
            }
            for (let i = 0; i < length; i++) {
                let vehiculo = JSON.parse(localStorage.getItem(String("vM" + i)));
                if (vehiculo != null && vehiculo.carrito) {
                    this.encargados.push(vehiculo);
                }
            }
        },

        getRepuestos() {
            this.repuestos = [];
            let length = 0;
            try {
                length = parseInt(JSON.parse(localStorage.getItem("lengthr")));
            } catch (e) {
                return;
            }
            //length++;
            for (let i = 0; i < length; i++) {
                let repuesto = JSON.parse(localStorage.getItem(String("r" + i)));
                if (repuesto != null && repuesto.carrito) {
                    this.repuestos.push(repuesto);
                }
            }
        },
        calcularTotal() {
            this.vehiculos.forEach(v => {
                if (v.PurchasedPrice != null) {
                    if (v.descontado > 0) {
                        this.total += v.descontado;
                    } else {
                        this.total += v.PurchasedPrice;
                    }
                }
            });

            this.vehiculos.forEach(v => {
                if (v.SuggestedPrice != null) {
                    if (v.descontado > 0) {
                        this.total += v.descontado;
                    } else {
                        this.total += v.SuggestedPrice;
                    }
                }
            });

            this.repuestos.forEach(v => {
                if (v.Price != null) {
                    if (v.descontado > 0) {
                        this.total += v.descontado;
                    } else {
                        this.total += v.Price;
                    }
                }
            });

            
            this.encargados.forEach(v => {
                if (v.SuggestedPrice != null) {
                    if (v.descontado > 0) {
                        this.total += v.descontado;
                    } else {
                        this.total += v.SuggestedPrice;
                    }
                }
            });
        },
        
        mostrarCarrito() {
            this.carritoCompleto = this.carritoCompletoD;
            this.getVehiculos();
            this.getEncargados();
            this.getRepuestos();
            this.calcularTotal();
            if (this.vehiculos.length > 0 || this.repuestos.length > 0 || this.encargados.length>0) {
                this.dialogDetalle = true;
            }
        },
    }
};
</script>
