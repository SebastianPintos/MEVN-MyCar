<script>
import {Pie} from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Pie,
  data: () => ({
    incomesList: [0,0,0],
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "right",
                    labels: {
                        fontFamily: "Roboto",
                        fontColor: "white",
                        fontSize: 16
                    }
                },

        }
  }),

  mounted () {
    setTimeout(() => { this.getValues()}, 1000);
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
                 this.incomesList[0] += branch.vehicle
                 this.incomesList[1] += branch.service
                 this.incomesList[2] += branch.product
             })
         })
         .then(() => this.renderChart({
                labels: ["Vehículos","Servicios", "Productos"],
                fontColor: "white",
                datasets: [
                {   
                    label: "Total Ingresos",
                    data: this.incomesList,
                    backgroundColor: ["#F44336","#FFEE58","#3F51B5"]
                    
                }
              ]
                }, this.options))
        }
      
    }
}
</script>

<style>
#pie-chart{
    padding: 20px;
}
</style>