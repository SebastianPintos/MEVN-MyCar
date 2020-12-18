<script>
import { Bar } from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Bar,
  data: () => ({
    vehiclesIncomes: [],
    productsIncomes: [],
    servicesIncomes: [],
    labelsList: [],
    options: {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
                    labels: {
                        fontFamily: "Roboto",
                        fontColor: "white",
                        fontSize: 16
                    }
                },
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    ticks: {
                            fontFamily: "Roboto",
                            fontColor: "white"
                        }
                }],
                yAxes: [
                    {
                        stacked: true,
                        gridLines: {
                        color: "rgba(255, 255, 255, 0.7)",
                    },
                        ticks: {
                            beginAtZero: true,
                            fontFamily: "Roboto",
                            fontColor: "white"
                        }
                    }]
            },
        }
  }),

  mounted () {
    setTimeout(() => { this.getValues()}, 2500);
  },
  methods: {
        getValues(){
            let date = new Date();
            date.setDate(date.getDate() -  date.getDate()+1);
            axios.post(urlAPI + 'report/incomeDiscriminated',{
              "dateStart": date,
              "dateFinish": new Date()
         })
         .then(data => {
             data.data.incomeDiscriminated.forEach(branch => {
                 this.labelsList.push(branch.name)
                 this.vehiclesIncomes.push(branch.vehicle)
                 this.servicesIncomes.push(branch.service)
                 this.productsIncomes.push(branch.product)
             })
         })
         .then(() => this.renderChart({
                barPercentage: 0.5,
                barThickness: 2,
                maxBarThickness: 2,
                labels: this.labelsList,
                fontColor: "white",
                datasets: [
                {   
                    label: "Vehiculos",
                    backgroundColor: "#9E9E9E",
                    data: this.vehiclesIncomes,
                    
                },
                {
                    label: "Servicios",
                    backgroundColor: "#BDBDBD",
                    data: this.servicesIncomes
                },
                {
                    label: "Productos",
                    backgroundColor: "#EEEEEE",
                    data: this.productsIncomes
                }
            ]
                }, this.options))
        }
      
    }
}
</script>

<style>
</style>