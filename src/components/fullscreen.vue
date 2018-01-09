<template>
  <div id="app">
    <com-info></com-info>
  </div>
</template>

<script>
  import comInfo from "./pages/comInfo";

  export default{
    data(){
      return {

      }
    },
    components:{
      comInfo
    }
  }
</script>

<style>
  @import "../css/echarts.css";
  @import "../css/detail.css";
</style>
