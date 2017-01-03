// Commons.js

var currencyNames=[];
var currencyArr=[];
var app=angular.module("myapp", []);

//Controller 
app.controller("MyController", function($scope,$http) {

  $http.get("/getCurrency").then(function(response) {
    currencyArr= response.data;
    var i=0;
    for(var key in currencyArr) {
      if(key=='time') continue;
      currencyNames[i]=key;i++;
    }

    $scope.myData = response.data;
  });


  //Calls metho to generate the graph
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
     $('.row').css('opacity','0.5');
     if($scope.fromCurrency==undefined || $scope.toCurrency==undefined || document.getElementById('currency').value=='') {$('.row').css('opacity','1');return false;}
       $http.get('/convert', {
        params: { from: $scope.fromCurrency,to:$scope.toCurrency,currency:document.getElementById('currency').value} }).then(function(response) {
          console.log(response.data);
          $scope.name=response.data;
          document.getElementById("textforconversion").textContent="1 "+$scope.fromCurrency+" equals "+ 
          ($scope.name/document.getElementById('currency').value).toFixed(2)+" " + $scope.toCurrency;
          $('.row').css('opacity','1');
        });
    }

      $scope.from=currencyNames;
      $scope.to=currencyNames;
});
