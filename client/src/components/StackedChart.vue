<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data: () => ({
    chartdata: {
       barPercentage: 0.5,
        barThickness: 2,
        maxBarThickness: 2,
      labels: ['San Miguel', 'Olivos','Microcentro', 'Quilmes','Cordoba'],
      fontColor: "white",
      datasets: [
        {   
            label: "Vehiculos",
            backgroundColor: "#9E9E9E",
            data: [20,40,50,50,70],
            
        },
        {
            label: "Servicios",
            backgroundColor: "#BDBDBD",
            data: [10,20,30,40,50]
        },
        {
            label: "Productos",
            backgroundColor: "#EEEEEE",
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
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>
</style>