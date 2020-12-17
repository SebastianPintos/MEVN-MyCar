<script>
import {Bar} from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Bar,
  data: () => ({
    chartdata: {
      labels: ['San Miguel', 'Olivos','Microcentro', 'Quilmes','Cordoba'],
      fontColor: "white",
      datasets: [
        {   
            label: "Total Ingresos",
            backgroundColor: "#F5F5F5",
            data: [20,40,50,50,70],
            
        },
        {
            label: "Total Ingresos",
            backgroundColor: "#B1B1B1",
            data: [10,20,30,40,50]
        }
      ]
    },
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
    this.renderChart(this.chartdata, this.options)
  },
  methods (){
  }
}
</script>

<style>
#bar-chart{
    padding: 10px
}
</style>