<template>
  <div>
    <h3>Bar Chart Example in Vue</h3>
    <pie-chart :data="chartData" :options="chartOptions"></pie-chart>
  </div>
</template>

<script>
import PieChart from './PieChart.js';

export default {
  name: 'graphProducts',
  components: {
    PieChart
  },
  beforeMount () {
    this.chartData = this.$route.params.data;
    this.chartOptions = this.$route.params.options;
  },
  data() {
    return {
      chartData: null,
      chartOptions: null
    }
  }
}
</script>