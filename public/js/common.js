  var markers=[];
  var values=[];
  var data={};
  var arr=[];
  var app=angular.module("myapp", []);

  app.controller("MyController", function($scope,$http,$window) {

    $http.get("/getCurrency").then(function(response) {
      arr= response.data;
      var i=0;
      for(var k in arr) {
        if(k=='time') continue;
        values[i]=k;i++;
      }

      $scope.myData = response.data;
    });


    $http.get("/getGraph").then(function(response) {
      createGraph(response.data);
    });



    $scope.updateFrom=function (currency){
        $scope.fromCurrency=currency;
      }
    $scope.updateTo=function (currency){
        $scope.toCurrency=currency;
        $scope.convert();
      }

    $scope.convert=function(){

       if($scope.fromCurrency==undefined || $scope.toCurrency==undefined || document.getElementById('currency').value=='') return false;
         $http.get('/convert', {
          params: { from: $scope.fromCurrency,to:$scope.toCurrency,currency:document.getElementById('currency').value} }).then(function(response) {
            console.log(response.data);
            $scope.name=response.data;
          });
      }

        $scope.from=values;
        $scope.to=values;
  });



function createGraph(dataArray){
  var seriesData = []; var buildSeries = [];var k;var datum=[];
  var palette = new Rickshaw.Color.Palette({scheme: 'munin'});

  for (var i =0;i<values.length;i++) {
    for (k=dataArray.length-1;k>=0;k--) {
      datum.push({x:Math.round((new Date(dataArray[k].time)).getTime())/1000, y: Number(dataArray[k][values[i]]) });  
    }
    seriesData[k]=datum;
    var disable=true;
    if(values[i]=='USD' || values[i]=='NZD' || values[i]=='GBP') disable =false;
    buildSeries.push({color:palette.color() ,data: seriesData[k], name: values[i], disabled: disable });
    datum=[];
  }
// instantiate our graph!

var graph = new Rickshaw.Graph( {
  element: document.getElementById("chart"),
  width: 1060,
  height: 350,
  renderer: 'line',
  series: buildSeries,
  padding: {top: 0.02, left: 0.02, right: 0.02, bottom: 0.0},
} );

graph.render();

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: graph
} );

var legend = new Rickshaw.Graph.Legend( {
  graph: graph,
  element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: graph,
  legend: legend
} );

var x_axis = new Rickshaw.Graph.Axis.X({
  graph: graph,
  timeUnit:'month',
  element: document.getElementById('x_axis'),
  tickFormat: function(x){
    return new Date(x * 1000).toLocaleDateString();
  }
});
x_axis.render();

var yAxis = new Rickshaw.Graph.Axis.Y({
  graph: graph,
  element: document.getElementById('y_axis'),
});
yAxis.render();
formatAxis();

}

function formatAxis(){
$('#x_axis text').css('fill', 'white');
$('#x_axis path').css('stroke', 'white');
$('#y_axis text').css('fill', 'white');
$('#y_axis path').css('stroke', 'white');
$('#legend .action').css('opacity','1');
}
