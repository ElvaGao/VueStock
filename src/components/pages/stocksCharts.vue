<template>
  <!-- 中部开始 -->
  <div class="content-bar">
        <!--K线图开始-->
        <div class="canvas kline" id="kline">
          <!-- echarts图开始 -->
          <div class="kline-charts-container">
            <div id="kline_charts" class="kline-charts"></div>
          </div>
          <!-- echarts图结束 -->
        </div>
        <!--K线图结束-->
    <!-- echarts图形结束 -->
  </div>
  <!-- 中部结束 -->
</template>
<script>
  import echarts from 'echarts';

  export default{
    data(){
      return {
        HistoryData:{
          hCategoryList:[],
          hValuesList:[],
          hVolumesList:[]
        },
        mychart:null,
        socket:null,
        ws:null,
        lastClose: null,
        // 查询历史数据
        HistoryKQAll: {
          "InstrumentID":"1",
          "ExchangeID":"2",
          "MsgType":"C213",
          "StartIndex":"-1",
          "StartDate":"0",
          "Count":"200",
          "StartTime":"0"
        },
        // 订阅分钟K线
        KQAll: {
          "InstrumentID":"1",
          "ExchangeID":"2",
          "MsgType":"S101",
          "DesscriptionType":"3",
          "Instrumenttype":"5"
        }
      }
    },
    methods:{
      WebSocketConnect: function(){
        var lockReconnect = false;//避免重复连接 连接锁如果有正在连接的则锁住
        var wsUrl = 'ws://103.66.33.67:443';
        var heartSend = {"MsgType":"C646","ExchangeID":"101","InstrumentID":"1044"};
        var timeout = 60000,//60秒
          timeoutObj = null,
          serverTimeoutObj = null;
        var _target = this;
        //建立socket连接

        _target.WebSocketConnect.prototype.createWebSocket = function () {
          try {
            this.ws = new WebSocket(wsUrl);
            return this.ws;
          } catch (e) {
            this.reconnect(wsUrl); //如果失败重连
          }
        };
        //socket重连
        _target.WebSocketConnect.prototype.reconnect = function () {
          if (lockReconnect) return;
          lockReconnect = true;
          //没连接上会一直重连，设置延迟避免请求过多
          setTimeout(function () {
            _target.ws = _target.createWebSocket(wsUrl);
            initSocketEvent();
            lockReconnect = false;
          }, 2000);
        };

        //发送请求
        _target.WebSocketConnect.prototype.request = function (data) {
          _target.ws.send(JSON.stringify(data));
        };

        //重置心跳包
        _target.WebSocketConnect.prototype.reset = function () {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
        };

        //开始心跳包
        _target.WebSocketConnect.prototype.start = function () {
          var self = this;
          this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            self.request(heartSend);
            self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
              self.ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, timeout)
          }, timeout)
        };
      },
      initSocketEvent: function(){
        var _this = this;
        this.ws.onclose = function () {
          this.socket.reconnect(); //终端重连
        };
        this.ws.onerror = function () {
          this.socket.reconnect(); //报错重连
        };
        this.ws.onopen = function () {

          //心跳检测重置
          _this.socket.reset().start(); //都第一次建立连接则启动心跳包
          _this.socket.request(_this.HistoryKQAll);


        };
        this.ws.onmessage = function (evt) {
          var jsons  = evt.data.split("|");  //每个json包结束都带有一个| 所以分割最后一个为空
          $.each(jsons,function (i,o) {
            if(o!==""){
              var data = eval("(" + o + ")");
              var dataList = data.d?data.d:data;
              var MsgType =  data["MsgType"] || data[0]["MsgType"]; //暂时用他来区分推送还是历史数据 如果存在是历史数据,否则推送行情

              // klineType-区分查询历史数据和指数/个股信息
              switch(MsgType){
                case "Q213":        // 订阅分钟线应答
                  _this.KCharts(dataList);
                  break;
                case "R213":        // 分钟K线历史数据查询
                  _this.socket.request(_this.KQAll);
                  _this.KCharts(dataList, "history");
                  break;
                case "R646":  //心跳包
                default:
              }
            }
          });
          _this.socket.reset().start(); //都第一次建立连接则启动心跳包
        }
      },
      // K线图方法
      KCharts: function(dataList, isHistory){
        if(dataList.length>0){
          $("#withoutData").hide().siblings().show();

          // 解析数据
          var dataJsons = this.splitData(dataList, isHistory);
          // 存储数据
          this.saveData(dataJsons, isHistory);
          // 画图
          this.chartPaint(isHistory);
        }
      },
      splitData: function(data, isHistory){
        var _this = this;
        let k_categoryData = [],                // x轴分割线坐标数组
          k_values = [],                      // 二维数组：开收低高-四个数值的数组-蜡烛图
          k_volumns = [];                     // 柱形图数据-成交量
        // 遍历json，将它们push进不同的数组

        $.each(data,function(i,object){

          let e_time = object.Time;
          k_categoryData.push(e_time);

          if(!_this.lastClose){
            _this.lastClose = object.Open;                          // 上一根柱子的收盘价
          }
          // 如果是最后一条数据的更新，_this.lastClose就是前一根柱子的收盘价
          if(k_categoryData[0].toString() == _this.HistoryData.hCategoryList[_this.HistoryData.hCategoryList.length-1]){
            _this.lastClose = _this.HistoryData.hValuesList[_this.HistoryData.hValuesList.length-2][1];
          }

          let e_open = (object.Open),          // 开
            e_highest = (object.High),       // 高
            e_lowest = (object.Low),         // 低
            e_price = (!isHistory)?(object.Last):(object.Price),           // 收盘价
            e_value = [                                       // 开收低高-蜡烛图数据格式
              e_open,
              e_price,
              e_lowest,
              e_highest
            ],
            e_volumnData = object.Volume,
            e_volume;                              // 成交量---单位：股

          if(isHistory){
            e_volume = (e_price-e_open)>=0?[i,e_volumnData,-1]:[i,e_volumnData,1];   // 成交量-数组，存储索引，值，颜色对应的值
          }else{
            e_volume = (e_price-e_open)>=0?[_this.HistoryData.hVolumesList.length,e_volumnData,-1]:[_this.HistoryData.hVolumesList.length,e_volumnData,1];
          }

          _this.lastClose = e_price;

          // 每条数据存入数组中
          k_values.push(e_value);
          k_volumns.push(e_volume);
        });

        // 返回K线图所需数据对象
        return {
          categoryData: k_categoryData,
          values: k_values,
          volumes: k_volumns
        }
      },
      saveData:function(data, isHistory){
        let _this = this;
        if(isHistory){
          _this.HistoryData.hCategoryList = data.categoryData;
          _this.HistoryData.hValuesList = data.values;
          _this.HistoryData.hVolumesList = data.volumes;
        }else{
          var n_category = data.categoryData[0];  // 最后一分钟的时间
          var n_values = data.values[0];          // 要存储的values
          var n_volumes = data.volumes[0];            // 成交量
          var lastTime = _this.HistoryData.hCategoryList[_this.HistoryData.hCategoryList.length-1];

          // 最新一条是历史category数据中的最后一条，则更新最后一条数据,否则push到数组里面
          if(n_category.toString() == lastTime){
            n_volumes[0] = n_volumes[0]-1;
            _this.HistoryData.hValuesList[_this.HistoryData.hValuesList.length-1] = n_values;
            _this.HistoryData.hVolumesList[_this.HistoryData.hVolumesList.length-1] = n_volumes;
          }else{
            _this.HistoryData.hCategoryList.push(n_category);
            _this.HistoryData.hValuesList.push(n_values);
            _this.HistoryData.hVolumesList.push(n_volumes);
          };
        }
      },
      chartPaint:function(isHistory){

        let _this = this;
        if(isHistory){
          // 绘制K线图
          _this.mychart.setOption({
            animation: false,
            tooltip: {
              trigger: 'axis',
              showContent: false
            },
            axisPointer: {
              link: {xAxisIndex: 'all'},
              label: {
                backgroundColor: '#555'
              },
              type: 'line',
              lineStyle:{
                type: 'dotted',
                color: '#000'
              },
              show:true,
              triggerTooltip:false
            },
            grid: [
              {
                top: "5%",
                height: '62.4%'
              },
              {
                top: '77.8%',
                height: '12.2%'
              },
            ],
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100
              },
              {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '91.5%',
                start: 0,
                end: 100,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize:'100%',
                handleStyle:{
                  color:"#f2f2f2",
                  borderColor: "#b4b4b4"
                },
                dataBackground: {
                  lineStyle: {
                    color: "rgba(0,0,0,1)"
                  },
                  areaStyle: {
                    color: "rgba(0,0,0,0)"
                  }
                },
                labelFormatter: function (valueStr) {
                  return _this.HistoryData.hCategoryList[valueStr];
                },
                showDetail: true
              },
            ],
            visualMap: {
              show: false,
              seriesIndex: 1,
              dimension: 2,
              pieces: [
                {   value: 1,
                  color: '#3bc25b'
                },
                {
                  value: -1,
                  color: "#e22f2a"
                }
              ]
            },
            xAxis: [
              {
                type: 'category',
                data: _this.HistoryData.hCategoryList,
                scale: true,
                boundaryGap: true,
                axisTick:{ show:false },
                axisLine: { show:false },
                splitLine: {
                  show: true,
                  interval: 15,
                  lineStyle: {
                    color: '#e5e5e5'
                  }
                },
                axisLabel: {
                  show: true,
                  color: '#999',
                  fontSize: 14,
                  formatter : function(value, index){
                    return value;
                  }
                },
                axisPointer: {
                  show:true,
                  label: {
                    show:true,
                    formatter: function(params){
                      return params.value.replace(/-/g,"/");
                    }
                  }
                }

              },
              {
                type: 'category',
                gridIndex: 1,
                data: _this.HistoryData.hCategoryList,
                scale: true,
                axisTick: { show:false },
                boundaryGap: true,
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                axisPointer: {
                  label: {
                    show:false
                  }
                }
              }
            ],
            yAxis: [
              {
                scale: true,
                splitNumber: 3,
                splitArea: { show: false },
                axisTick:{ show:false },
                axisLine: { show: false },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#e5e5e5'
                  }
                },
                axisLabel: {
                  show: true,
                  color: '#999',
                  fontSize: 14
                },
                axisPointer: {
                  show:true,
                  label: {
                    show:true
                  }
                }
              },
              {
                type:'value',
                scale: true,
                gridIndex: 1,
                min: 0,
                axisTick:{ show:false },
                axisLabel: {
                  show: true,
                  color: '#999',
                  fontSize: 14
                },
                axisLine: {
                  show: true,
                  inZero: true,
                  lineStyle: {
                    color: '#e5e5e5'
                  }
                },
                splitNumber: 2,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#e5e5e5'
                  }
                }
              }
            ],
            series: [
              {
                name: 'K',
                type: 'candlestick',
                showSymbol: false,
                hoverAnimation: false,
                itemStyle: {
                  normal: {
                    color: '#e22f2a',
                    color0: '#3bc25b',
                    borderColor: '#e22f2a',
                    borderColor0: '#3bc25b'
                  }
                },
                data: _this.HistoryData.hValuesList,
                markPoint: {
                  symbolSize: 20,
                  data: [
                    {
                      name: 'highest value',
                      type: 'max',
                      valueDim: 'highest',
                      label: {
                        normal: {
                          position: 'insideBottomLeft',
                          color: "#555",
                          fontSize: 14,
                          offset: [10,20]
                        }
                      },
                      itemStyle: {
                        normal:{
                          color: "rgba(0,0,0,0)"
                        }
                      }
                    },
                    {
                      name: 'lowest value',
                      type: 'min',
                      valueDim: 'lowest',
                      label: {
                        normal: {
                          position: 'insideTopLeft',
                          color: "#555",
                          fontSize: 14,
                          offset: [10,10]
                        }
                      },
                      itemStyle: {
                        normal:{
                          color: "rgba(0,0,0,0)"
                        }
                      }
                    }
                  ]
                },

              },
              {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: _this.HistoryData.hVolumesList,
                itemStyle: {
                  normal: {
                    color: '#e22f2a',
                    color0: '#3bc25b'
                  }
                },
              }
            ]
          });
        }else{
          // 初始化并显示数据栏和数据信息框的信息
          _this.mychart.setOption({
            xAxis:[
              {
                data: _this.HistoryData.hCategoryList
              },
              {
                data: _this.HistoryData.hCategoryList
              }
            ],
            series: [
              {
                data: _this.HistoryData.hValuesList,
              },
              {
                data: _this.HistoryData.hVolumesList
              },

            ]
          });
        }

        console.log(_this.mychart.getOption())
      }
    },
    mounted: function(){
      this.mychart = echarts.init(document.getElementById('kline_charts'))
      this.socket = new this.WebSocketConnect();
      this.ws = this.socket.createWebSocket();
      this.initSocketEvent();
    }
  }
</script>
<style>
  @import "../../css/echarts.css";
</style>
