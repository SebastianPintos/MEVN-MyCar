<template>
  <v-container fluid class="bkg-reportes">
      <v-container fluid>
          <v-btn @click="getValues()"></v-btn>
          <v-row justify="space-around">
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Ingresos</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">$ 19.5K</h1>

               <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del ultimo mes</span>

                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Egresos</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">$ 12.2K</h1>

                
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del ultimo mes</span>

                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Extra</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">Valor</h1>
                
                <v-divider class="my-2"></v-divider>
                <v-icon
                    class="mr-2"
                    small
                >
                    mdi-clock
                </v-icon>
                <span class="caption grey--text font-weight-light">Actualizado hace {{tiempoCard2}} segundos</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Extra</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">Valor</h1>
                
                <v-divider class="my-2"></v-divider>
                <v-icon
                    class="mr-2"
                    small
                >
                    mdi-clock
                </v-icon>
                <span class="caption grey--text font-weight-light">Actualizado hace {{tiempoCard2}} segundos</span>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row class="row-reports">
        <v-col cols="12" md="4">
            <v-card
                class="mt-4 mx-auto"
            >
            <v-container>
                <v-sheet
                class="v-sheet--offset mx-auto"
                color="teal"
                elevation="12"
                max-width="calc(100% - 10px)"
                >
                <div class="chart">   
                    <BarChart/>
                </div>
                </v-sheet>
            </v-container>

            <div class="card-text">
                <v-card-text class="pt-0">
                <div class="title font-weight-light mb-2">
                    Ingresos/Egresos
                </div>
                <div class="subheading font-weight-light grey--text">
                    Last Campaign Performance
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del ultimo mes</span>
                </v-card-text>
            </div>
            </v-card>
        </v-col>

        <v-col cols="12" md="4">
            <v-card
                class="mt-4 mx-auto"
            >
            <v-container>
                <v-sheet
                class="v-sheet--offset mx-auto"
                color="#9C27B0"
                elevation="12"
                max-width="calc(100% - 10px)"
                >
                <div class="chart">   
                    <StackedChart/>
                </div>
                </v-sheet>
            </v-container>

            <div class="card-text">
                <v-card-text class="pt-0">
                <div class="title font-weight-light mb-2">
                    Ingresos/Egresos por tipo
                </div>
                <div class="subheading font-weight-light grey--text">
                    Last Campaign Performance
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del ultimo mes</span>
                </v-card-text>
            </div>
            </v-card>
        </v-col>

        <v-col cols="12" md="4">
            <v-card
                class="mt-4 mx-auto"
            >
            <v-container>
                <v-sheet
                class="v-sheet--offset mx-auto"
                color="#FB8C00"
                elevation="12"
                max-width="calc(100% - 10px)"
                >
                <div class="chart">   
                    <PieChart/>
                </div>
                </v-sheet>
            </v-container>

            <div class="card-text">
                <v-card-text class="pt-0">
                <div class="title font-weight-light mb-2">
                    Ingresos/Egresos por tipo
                </div>
                <div class="subheading font-weight-light grey--text">
                    Last Campaign Performance
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores de todas las sucursales</span>
                </v-card-text>
            </div>
            </v-card>
        </v-col>
        
    </v-row>
      </v-container>
    
  </v-container>
    
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import StackedChart from '@/components/StackedChart.vue';
import PieChart from '@/components/PieChart.vue';
import axios from "axios";
import urlAPI from "../config/config.js"
export default {
    components:{
        BarChart,
        PieChart,
        StackedChart
    },
    data: () => ({
    }),
    methods: {
        getValues(){
            console.log("Test")
            axios.post(urlAPI + 'report/incomeExpenses',{
              "dateStart": new Date(),
              "dateFinish": new Date()
         })
         .then(data => console.log(data))
        }
      
    }
}
</script>

<style>
.cardValue{
    padding: 15px;
}
.chart >*{
    height: 280px;
}
.card-text{
    margin-top: -20px;
}
.v-sheet--offset {
    top: -30px;
    position: relative;
    border-radius: 4px;
}
.bkg-reportes{
    background-color: #d3d3d3;
    height: 100vh;
}
.row-reports{
    padding-top: 3%;
}
</style>