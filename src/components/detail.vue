<template>
  <div id="app">
    <stocks-charts></stocks-charts>

  </div>
</template>

<script>

  import stocksCharts from "./pages/stocksCharts";

  export default{
    data(){
      return {}
    },
    components: { stocksCharts }
  }
</script>
