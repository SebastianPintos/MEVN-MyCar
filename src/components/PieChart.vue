<script>
import {Pie} from 'vue-chartjs'
import axios from "axios"
import urlAPI from "../config/config.js"

export default {
  extends: Pie,
  props:[
      'incomesList'
      ],
  data: () => ({
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
    this.getValues()
  },
  methods: {
        getValues(){
            console.log(this.incomesList)
            this.renderChart({
                labels: ["Vehículos","Servicios", "Productos"],
                fontColor: "white",
                datasets: [
                {   
                    label: "Total Ingresos",
                    data: this.incomesList,
                    backgroundColor: ["#F44336","#FFEE58","#3F51B5"],                    
                }
              ]
                }, this.options)
        }
      
    }
}
</script>

<style>
#pie-chart{
    padding: 20px;
}
</style>