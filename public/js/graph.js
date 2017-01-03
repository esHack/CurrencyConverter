//Creates the Graphical represntaion of all the currencies.
function createGraph(dataArray){
var seriesData = []; var buildSeries = [];var k;var datum=[];
var palette = new Rickshaw.Color.Palette({scheme: 'munin'});

for (var i =0;i<currencyNames.length;i++) {
  for (k=dataArray.length-1;k>=0;k--) {
    datum.push({x:Math.round((new Date(dataArray[k].time)).getTime())/1000, y: Number(dataArray[k][currencyNames[i]]) });  
  }
  seriesData[k]=datum;
  var disable=true;
  //Just to create initial graph.. (Not required). Marking the required lines/currencies
  if(currencyNames[i]=='USD' || currencyNames[i]=='NZD' || currencyNames[i]=='GBP' || currencyNames[i]=='MYR' || currencyNames[i]=='ILS' || currencyNames[i]=='TRY') disable =false;
  buildSeries.push({color:palette.color() ,data: seriesData[k], name: currencyNames[i], disabled: disable });
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

//Formatting x-axis values to represnt dates
var x_axis = new Rickshaw.Graph.Axis.X({
graph: graph,
timeUnit:'month',
element: document.getElementById('x_axis'),
tickFormat: function(x){
  return new Date(x * 1000).toLocaleDateString();
}
});
x_axis.render();

//Formating the y-axis values
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