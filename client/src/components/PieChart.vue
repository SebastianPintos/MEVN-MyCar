<script>
import {Pie} from 'vue-chartjs'

export default {
  extends: Pie,
  data: () => ({
    chartdata: {
      labels: ['Vehiculos', 'Productos','Reservas'],
      fontColor: "white",
      datasets: [
        {   
            label: "Total Ingresos",
            data: [20,40,50],
            backgroundColor: ["#F44336","#FFEE58","#3F51B5"]
            
        }
      ]
    },
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
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>
#pie-chart{
    padding: 20px;
}
</style>