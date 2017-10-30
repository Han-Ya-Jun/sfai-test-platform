var Demo3={
	init:function(){
		Demo3.initButton();
		Demo3.initStyle();
		Demo3.initEchart1();
		Demo3.initEchart2();
		Demo3.initEchart3();
	},
	
	initButton:function(){
		
	},
	
	initStyle:function(){
		
	},
	
	initEchart1:function(){
		var myChart = echarts.init(document.getElementById('chart1'));
		var option = {
			    title : {
			        text: '某站点用户访问来源',
			        subtext: '纯属虚构',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
			    },
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:[
			                {value:335, name:'直接访问'},
			                {value:310, name:'邮件营销'},
			                {value:234, name:'联盟广告'},
			                {value:135, name:'视频广告'},
			                {value:1548, name:'搜索引擎'}
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
		window.addEventListener("resize", function () {
       	 myChart.resize();
        });
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option,true);
	},
	
	initEchart2:function(){
		var myChart = echarts.init(document.getElementById('chart2'));
		var option = {
			    tooltip : {
			        formatter: "{a} <br/>{b} : {c}%"
			    },
			    toolbox: {
			        feature: {
			            restore: {},
			            saveAsImage: {}
			        }
			    },
			    series: [
			        {
			            name: '业务指标',
			            type: 'gauge',
			            detail: {formatter:'{value}%'},
			            data: [{value: 50, name: '完成率'}]
			        }
			    ]
			};

		window.addEventListener("resize", function () {
       	 myChart.resize();
        });
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option,true);
		
		setInterval(function () {
		    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
		    myChart.setOption(option, true);
		},2000);
	},
	
	initEchart3:function(){
		var myChart = echarts.init(document.getElementById('chart3'));
		var option = {
	            title: {
	                text: 'ECharts 入门示例'
	            },
	            tooltip: {},
	            legend: {
	                data:['销量']
	            },
	            xAxis: {
	                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
	            },
	            yAxis: {},
	            series: [{
	                name: '销量',
	                type: 'bar',
	                data: [5, 20, 36, 10, 10, 20]
	            }]
	        };
         window.addEventListener("resize", function () {
        	 myChart.resize();
         });
	     // 使用刚指定的配置项和数据显示图表。
	     myChart.setOption(option,true);
	}
};

$(document).ready(function(){ 
    Demo3.init();
});

