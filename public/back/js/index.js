$(function(){
   //初始化实例
   var myChart1 = echarts.init(document.querySelector(".echart-left"));
   //配置数据
   var options1 = {
     //title
     title:{
       text:"2017年注册人数"
     },
     //提示工具
     toolTip:{},
     legend:{
       data:["人数"]
     },
     xAxis:{
       data:["1月","2月","3月","4月","5月","六月"]
     },
     yAxis:{},
     series:[{
       name:"人数",
       type:"bar",
       data:[1000,1500,1200,1300,1600,1100]
     }]
   }
   // 显示图表
   myChart1.setOption(options1); 

   //表2
   var myChart2 = echarts.init(document.querySelector(".echart-right"));
   options2 = {
    title : {
        text: '热门品牌销售',
        subtext: '2017年6月',
        x:'right'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['新百伦','李宁','阿迪王','耐克','阿迪']
    },
    series : [
        {
            name: '品牌',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
              {value:335, name:'阿迪'},
              {value:310, name:'耐克'},
              {value:234, name:'三叶草'},
              {value:135, name:'阿迪王'},
              {value:1548, name:'匡威'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
myChart2.setOption(options2)


})