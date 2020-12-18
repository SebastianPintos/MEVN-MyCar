<template>
  <v-container fluid class="bkg-reportes">
      <v-container fluid>
          <v-row justify="space-around">
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Ingresos</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">$ {{totalIncomes.toFixed(2)}}M</h1>

               <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Periodo: Mes actual</span>

                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Egresos</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">$ {{totalExpenses.toFixed(2)}}M</h1>

                
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Periodo: Mes actual</span>

                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card
                class="mt-4 mx-auto"
            >
                <v-card-title>Mejor vendedor</v-card-title>
                <v-card-text class="pt-0">
                
                    <h1 class="cardValue">{{bestSellerName}}</h1>

                <div class="subheading font-weight-light grey--text">
                    <b>Total vendido: ${{bestSellerTotal}}</b>
                </div>
                
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Periodo: Mes actual</span>
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
                    <BarChart :labelsList="['Label3','Label3','Label3']" />
                </div>
                </v-sheet>
            </v-container>

            <div class="card-text">
                <v-card-text class="pt-0">
                <div class="title font-weight-light mb-2">
                    Ingresos/Egresos
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del mes actual</span>
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
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del mes actual</span>
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
                    Ingresos/Egresos por tipo <b>intersucursal</b> 
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="caption grey--text font-weight-light">Valores del mes actual</span>
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
        totalIncomes: 0,
        totalExpenses: 0,
        bestSellerName: "",
        bestSellerTotal: "",
    }),
    mounted() {
        this.getValues()
    },
    methods: {
         getValues(){
            let date = new Date();
            date.setDate(date.getDate() -  date.getDate()+1);
            axios.post(urlAPI + 'report/incomeExpenses',{
              "dateStart": date,
              "dateFinish": new Date()
         })
         .then(data => {
             data.data.income.forEach( branch => {
                 this.totalIncomes += branch.money})
            if(data.data.expenses.length > 0){
             data.data.expenses.forEach( branchExpenses => this.totalExpenses += branchExpenses.money)
            }
             this.totalIncomes /= 1000000;
             this.totalExpenses /= 1000000;
         })

         axios.post(urlAPI + 'report/bestSeller',{
              "dateStart": date,
              "dateFinish": new Date()
         })
         .then(data => 
         {
             this.bestSellerName = data.data.bestSeller.name + " " + data.data.bestSeller.lastName
             this.bestSellerTotal = data.data.bestSeller.sells
         })
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
    padding: 20px;
}
.row-reports{
    padding-top: 3%;
}
</style>