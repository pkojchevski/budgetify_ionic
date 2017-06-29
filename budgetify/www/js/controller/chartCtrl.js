angular.module('myApp')
   .controller('chartCtrl',['$rootScope','$scope', '$log','$filter','_', '$translate',
    'barChart','pieChart', '$timeout', 'dbService', 'MONTHS_LIST_EN',
   	function($rootScope, $scope, $log, $filter, _, $translate, barChart, pieChart, $timeout, dbService, MONTHS_LIST_EN) {

 $scope.balanceCalc = false;
 $timeout(function() {
  $scope.balanceCalc = true;
 }, 1000);

$rootScope.selectedDate = $rootScope.selectedDate || moment().lang($rootScope.locale).format('YYYY-MMM');

  function calc() {
    $scope.records = $filter('arrangeRecords')($rootScope.AllRecords,'name');
  	if($scope.records !== 0) {
  	  $scope.labels = $filter('getFromList')($scope.records);

        if(typeof $rootScope.period === 'undefined' || $rootScope.period === 'month') {
          $scope.recordsweek = [];
          _.forEach($rootScope.weekList, function(week) {
            var singleweek = $rootScope.AllRecords.filter(function(obj) {
                return parseInt(obj.week) === week;
              });
          $scope.recordsweek = $scope.recordsweek.concat($filter('arrangeRecords')(singleweek,'name')).
          filter(function(item) {
              return !item['income'];
              })
              .map(function(obj) {
                  obj.value = parseInt(obj.value);
                  return obj;
               })
                .sort(function(a,b) {
                   return a.week - b.week;
               })
          });

              $scope.barData = [{
               key:'Cumulative Return',
               values:$scope.recordsweek
          }];
          $scope.barOptions = barChart($scope.barData, 'week');
      }

        if($rootScope.period === 'year') {
           $scope.recordsyear = [];
          _.forEach(MONTHS_LIST_EN, function(month) {
            var singlemonth = $rootScope.AllRecords
            .filter(function(obj) {
              return !obj.income;
            })
            .filter(function(obj) {
                return obj.month.substring(5,obj.month.split('').length) === month;
              });
          $scope.recordsyear = $scope.recordsyear.concat($filter('arrangeRecords')(singlemonth,'name'))
          .map(function(obj) {
              obj.value = parseInt(obj.value);
              // console.log('month:'+obj.month.substring(5,obj.month.split('').length));
              // obj.month = obj.month.substring(5,obj.month.split('').length);
              return obj;
               })
          .sort(function(a,b) {
            return a.month - b.month;
               })
           });
          _.forEach($scope.recordsyear, function(obj) {
            obj.month = $translate.instant(obj.month.substring(5, obj.month.split('').length));
           });
        $scope.barData = [{
          key:'Cumulative Return',
          values:$scope.recordsyear
          }];
          $scope.barOptions = barChart($scope.barData, 'month');
      }

        if($rootScope.period === 'week') {
          $rootScope.AllRecords.sort(function(a,b) {
             return new Date(a.dayDate).getTime() - new Date(b.dayDate).getTime();
          });
          _.forEach($rootScope.AllRecords, function(obj) {
            obj.dayDate = $translate.instant(moment(obj.dayDate).format('ddd'));
          });
        $scope.barData = [{
          key:'Cumulative Return',
          values:$rootScope.AllRecords.filter(function(item) {
              return !item['income'];
          })
          .map(function(obj) {
              obj.value = parseInt(obj.value);
              return obj;
          })
          }]; 
          $scope.barOptions = barChart($scope.barData, 'dayDate');
      }
     
      $scope.totalExpenses = $filter('getExpensesTot')($scope.records);
      $scope.totalIncome = $filter('getIncomeTot')($scope.records);
      $scope.balance = $scope.totalIncome - $scope.totalExpenses;

      //piechart
      $scope.dataTranslated = angular.copy($scope.labels);
      _.forEach($scope.dataTranslated, function(value, key) {
            value.name = $translate.instant(value.name);
        });
        $scope.data = $scope.dataTranslated;
        $scope.options = pieChart();
   }
  }

  calc();



}]);