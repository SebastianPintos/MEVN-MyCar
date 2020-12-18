<script>
import {Bar} from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Bar,
  data: () => ({
    incomesList: [],
    expensesList: [],
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
            let date = new Date();
            date.setDate(date.getDate() -  date.getDate()+1);
            axios.post(urlAPI + 'report/incomeExpenses',{
              "dateStart": date,
              "dateFinish": new Date()
         })
         .then(data => {
             data.data.income.forEach( branch => {
                 this.labelsList.push(branch.name)
                 this.incomesList.push(branch.money)})
             data.data.expenses.forEach( branch => this.expensesList.push(branch.money))

         })
         .then(() => this.renderChart({
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
                }, this.options))
        }
      
    }
}
</script>

<style>
#bar-chart{
    padding: 10px
}
</style>