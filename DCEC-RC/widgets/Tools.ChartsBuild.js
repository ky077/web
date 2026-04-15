/*
Tools.Charts.js
2016-11-23
Ray Hsu

Tools for AES-HAN Elementary system usage
*****************************************
參考:
http://www.chartjs.org/docs/#polar-area-chart-introduction
http://www.bootcss.com/p/chart.js/docs/

*/


// array Xaxis_                     : 橫軸欄位名稱['名稱1','名稱2','名稱3',...]
// array(key,value) Data_           : 資料集格式:array[{dataName:(string)資料集代表名稱,data:(array)[數字1,數字2,...]},...]
function BuildBarData(Xaxis_, Data_) {
    var barChartData = {
        labels: Xaxis_,
        datasets : [ ]
    };

    // -- 建立&設定資料集 --
    $.each(Data_, function (DatasetName, value) {
		
        barChartData.datasets.push({
            label: value['dataName'],
            data: value['data'],
			
            backgroundColor: 
			[
                '#ff8503',
                '#bf2320',
            ],
        })
    });
   
    return barChartData;
}
// -- ** 請注意!須將所有想要繪製的資料一併加入ArrayData_後呼叫此function，否則同一頁中只會繪製最後一筆圖表資料 ** --
// array ArrayData_     : [{Type : (sring)圖表類型 ,ParentNode_ID : (string)<div>ID ,ChartName : (string)圖表名稱 , Data: (array)各Build_OOO_Data資料}, ...]
function MainChartsDraw(ArrayData_) {
    window.onload = function () {
        $.each(ArrayData_, function (ArrayDataIndex, value) {
            var type = ArrayData_[ArrayDataIndex]['Type'];
            var ParentNode_ID = ArrayData_[ArrayDataIndex]['ParentNode_ID'];
            var ChartName = ArrayData_[ArrayDataIndex]['ChartName'];
            var Data = ArrayData_[ArrayDataIndex]['Data'];
			var categoryPercentage = ArrayData_[ArrayDataIndex]['categoryPercentage'];

            switch (type) {
                case 'bar':
                    var ctxBar = document.getElementById(ParentNode_ID).getContext("2d");
                    window.myBar = new Chart(eval(ctxBar), {
                        type: type,
                        data: Data,
                        options: {
                            //responsive: true,
							 title: {
                                display: false,
                                text: ChartName
                            },
                            legend: {
								display: false,
                                position: 'top',
                            },
							scales: {
								xAxes: [{
									display: true,
									scaleLabel: {
										display: true,
										labelString: '',
										fontSize: 15,
										fontFamily:'Arial, Helvetica, sans-serif, "Microsoft JhengHei"',
										fontColor:'#333',
									},
									gridLines: {
										display: false,
										color: "rgba(0,0,0,0.0)",
									},
									categoryPercentage: categoryPercentage, 
									barPercentage: 1 ,
									ticks: {
										fontSize: 15,
										fontFamily:'Arial, Helvetica, sans-serif, "Microsoft JhengHei"',
										fontColor:'#333',
									}
								}],
								yAxes: [{
									display: true,
									scaleLabel: {
										display: false,
										labelString: '分數',
										fontSize: 15,
										fontFamily:'Arial, Helvetica, sans-serif, "Microsoft JhengHei"',
										fontColor:'#333',
										
									},
									gridLines: {
										color: "#ccc",
									},
									ticks: {
										fontSize: 15	,
										fontFamily:'Arial, Helvetica, sans-serif, "Microsoft JhengHei"',
										fontColor:'#333',
										min: 0,
										max: 250,
										stepSize: 25,
										beginAtZero:true,
									}
								}]
							},
							tooltips: false,
							hover: {
							  animationDuration: 0
							},
							animation: {
								duration: 1,
								onComplete: function() {
									var chartInstance = this.chart,
										ctx = chartInstance.ctx;
							
									ctx.font = Chart.helpers.fontString(18, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
									ctx.fillStyle = '#333';
									ctx.textAlign = 'center';
									ctx.textBaseline = 'bottom';
							
									this.data.datasets.forEach(function(dataset, i) {
										var meta = chartInstance.controller.getDatasetMeta(i);
										meta.data.forEach(function(bar, index) {
											var data = dataset.data[index];
											ctx.fillText(data, bar._model.x, bar._model.y - 5);
										});
									});
								}
							},
                        }
                    });
                    break;

                default:
                    break;
            }
        });
    };
}