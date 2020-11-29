<template>
<div>
    <v-tabs background-color="#2764c4" tile dark grow>
        <v-tab @click="vistaVehiculos = true; vistaRepuestos = false;">Vehículos</v-tab>
        <v-tab @click=" vistaVehiculos = false; vistaRepuestos = true;">Repuestos</v-tab>
        <v-btn color="grey" style="height: 100%" @click="mostrarCarrito">
            <v-icon>mdi-cart-outline</v-icon>
        </v-btn>
    </v-tabs>

    <VentaVehiculos v-show="vistaVehiculos" />
    <VentaRepuestos v-show="vistaRepuestos" />
</div>
</template>

<script>
import VentaRepuestos from '@/components/VentaRepuestos.vue';
import VentaVehiculos from '@/components/VentaVehiculos.vue';

export default {
    data: () => ({
        vistaVehiculos: true,
        vistaRepuestos: false,
        carritoCompleto: {
            repuestosCarrito: [],
            vehiculosCarrito: [],
            totalRepuestos: 0,
            totalVehiculos: 0,
            total: 0
        },
        vehiculos: [],
        repuestos: []
    }),
    components: {
        VentaVehiculos,
        VentaRepuestos,
    },
    methods: {
        getVehiculos() {
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
        
        getRepuestos() {
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
        mostrarCarrito() {
            this.getVehiculos();
            this.getRepuestos();
            console.log("VEHICULOS: "+JSON.stringify(this.vehiculos));
            console.log("REPUESTOS: "+JSON.stringify(this.repuestos));
        },
    }
};
</script>
