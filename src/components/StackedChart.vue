<script>
import { Bar } from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Bar,
  props:[
      'vehiclesIncomes',
      'productsIncomes',
      'servicesIncomes',
      'labelsList',
  ],
  data: () => ({
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
    this.getValues();
  },
  methods: {
        getValues(){this.renderChart({
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
                }, this.options)
        }
      
    }
}
</script>

<style>
</style>