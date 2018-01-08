<template>
  <div id="app">
    <stock-info></stock-info>
    <stocks-charts></stocks-charts>
    <com-info></com-info>
  </div>
</template>

<script>
import stockInfo from "./pages/stockInfo";
import stocksCharts from "./pages/stocksCharts";
import comInfo from "./pages/comInfo";

export default{
  date(){
    return{

    }
  },
  components:{stockInfo,stocksCharts,comInfo}
}

</script>

<style>
  @import "./css/echarts.css";
  @import "./css/detail.css";

</style>
