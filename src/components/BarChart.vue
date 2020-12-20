<script>
import {Bar} from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Bar,
  props:[
      'incomesList',
      'expensesList',
      'labelsList'
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
  create () {
      
  },
  mounted(){
      this.getValues()
  },
  methods: {
        getValues(){
                this.renderChart({
                labels: this.labelsList,
                fontColor: "white",
                datasets: [
                    {   
                        label: "Total Ingresos",
                        backgroundColor: "#F5F5F5",
                        data: this.incomesList
                        
                    },
                    {
                        label: "Total Egresos",
                        backgroundColor: "#B1B1B1",
                        data: this.expensesList
                    }
                ]
                }, this.options)
        }
      
    }
}
</script>

<style>
#bar-chart{
    padding: 10px
}
</style>