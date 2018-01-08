<template>
  <!-- 中部开始 -->
  <div class="content-bar">
    <!-- echarts图形开始 -->
    <div class="box fl echarts">
      <div class="container">
        <div class="canvas" id="MLine">
          <div class="no-data" id="noData">亲，暂时没有数据哦~~~~ ^_^</div>
          <label class="canvasTitle" id="toolContent_M" style="display:none;"><i>2017-10-10 10:00</i>价<i>-</i>量<i>-</i>幅<i>-</i></label>
          <div id="main1" style="width:840px;height:520px;background-color:#fff;"></div>
          <div class="vol vol1" style="display:none;">Vol:<i>-</i></div>
          <label class="quantityRatio">LB:<i id="quantityRatio">0.86</i></label>
          <label class="quantityRatio">MACD:<i id="quantityRatio">0.86</i></label>
          <div class="chartsTab" style="display:none;"></div>
          <div id="toolContent" style="display:none;">
            <ul>
              <li class="fName"></li>
              <li><span class="dataTime">-</span></li>
              <li>价格 <span class="dataPrice"></span></li>
              <li>涨跌 <span class="change"></span></li>
              <li>成交 <span class="volume"></span></li>
            </ul>
          </div>
        </div>
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
            <!-- <div class="macd">
                <span class="macd-title">MACD</span><span class="macd-Dif">DIF : <em></em></span><span class="macd-Dea">DEA : <em></em></span><span class="macd-Macd">MACD : <em></em></span>
            </div>
            <div class="volMacd">
                <div class="vmMax">3.78</div>
                <div class="vmMin">1.93</div>
            </div>
            <div class="kline-buttons">
                <span class="active">MACD</span>
                <span>KDJ</span>
                <span>RSI</span>
                <span>BOLL</span>
                <span>WR</span>
                <span>DMI</span>
            </div> -->
            <!-- </div> -->

          </div>
          <!-- echarts图结束 -->
        </div>
        <!--K线图结束-->
      </div>
    </div>
    <div class="box fr cb-right">
      <div class="no-data no-data-k" id="withoutPKCJData"></div>
      <!-- 五档盘口 -->
      <div class="cb-pk"></div>
      <!-- 逐笔成交 -->
      <div class="cb-cj"></div>
    </div>
    <!-- echarts图形结束 -->
  </div>
  <!-- 中部结束 -->
</template>
