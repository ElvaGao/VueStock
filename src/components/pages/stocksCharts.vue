<template>
  <!-- 中部开始 -->
  <div class="content-bar">
    <!-- echarts图形开始 -->
    <div class="box fl echarts">
      <div class="container">
        <!--K线图开始-->
        <div class="canvas kline" id="kline">
          <div class="no-data no-data-k" id="withoutData">亲，暂时没有数据哦~~~~ ^_^</div>
          <!-- 上部信息显示开始 -->
          <ul class="list-inline text-center kline-info">
            <li><span class="date"></span></li>
            <li><span class="day"></span></li>
            <li><span class="time"></span></li>
            <li>价<span class="price red"></span></li>
            <li>均<span class="average red"></span></li>
            <li>量<span class="volume"></span></li>
            <li>幅<span class="z-value red"></span></li>
          </ul>
          <!-- <div class="kline-MAs">
              <span class="kline-MA5">MA5:<em></em></span>
              <span class="kline-MA10">MA10:<em></em></span>
              <span class="kline-MA20">MA20:<em></em></span>
              <span class="kline-MA30">MA30:<em></em></span>
          </div> -->
          <!-- 上部信息显示结束 -->
          <!-- echarts图开始 -->
          <div class="kline-charts-container">
            <div id="kline_charts" class="kline-charts"></div>
            <div id="kline_tooltip" class="kline-tooltip">
              <ul class="list-unstyled">
                <li><span class="name"></span></li>
                <li class="text-justify"><span class="date"></span><span class="day"></span><span class="time"></span></li>
                <li>开盘<span class="open pull-right red"></span></li>
                <li>最高<span class="highest pull-right red"></span></li>
                <li>最低<span class="lowest pull-right red"></span></li>
                <li>收盘<span class="price pull-right red"></span></li>
                <li>涨跌<span class="z-value pull-right red"></span></li>
                <li>成交<span class="volume pull-right"></span></li>
                <li>换手<span class="??? pull-right"></span></li>
                <li>振幅<span class="amplitude pull-right"></span></li>
              </ul>
            </div>

            <!-- <div class="bar-tools"> -->
            <div class="deal">
              <span class="deal-title">成交</span><span class="deal-Vol">VOL : <em></em></span><!-- <span class="deal-MA5">MA5 : <em></em></span><span class="deal-MA10">MA10 : <em></em></span> -->
            </div>
            <div class="volumn">
              <div class="volumeMax"></div>
              <div class="vol-unit"></div>
            </div>

          </div>
          <!-- echarts图结束 -->
        </div>
        <!--K线图结束-->
      </div>
    </div>
    <!-- echarts图形结束 -->
  </div>
  <!-- 中部结束 -->
</template>
<script>
  export default{
    data(){
      return{

      }
    },
    methods: {
      WebSocketConnect: function(){

      }
    }
  }
</script>
