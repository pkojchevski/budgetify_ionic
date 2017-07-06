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
   if($rootScope.AllRecords.length !== 0) {
    if(typeof $rootScope.period === 'undefined' || $rootScope.period === 'month') {
      var month = 'month'+ moment(new Date($rootScope.selection.date).toISOString()).lang('en').format('MMMM');
       $scope.monthRecords = $rootScope.AllRecords.filter(function(item) {
          return (item.month === month);
      }); 
      if($scope.monthRecords.length !== 0) {
          $scope.records = $filter('arrangeRecords')($scope.monthRecords, 'name');
          $scope.labels = $filter('getFromList')($scope.records);
          $scope.recordsweek = [];
          _.forEach($rootScope.weekList, function(week) {
            var singleweek = $scope.monthRecords.filter(function(obj) {
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
    }

    }

    if($rootScope.period === 'year') {
     var month = 'month'+ moment(new Date($rootScope.selection.date).toISOString()).lang('en').format('MMMM');
     $rootScope.selectedDate = selected || moment().format('YYYY-MMMM');
     $scope.yearRecords = $rootScope.AllRecords.filter(function(item) {
          return (item.year === $rootScope.selection.year);
     });
     if($scope.yearRecords.length !== 0) {
      $scope.records = $filter('arrangeRecords')($scope.yearRecords, 'name');
      $scope.labels = $filter('getFromList')($scope.records);
      $scope.recordsyear = [];
      _.forEach(MONTHS_LIST_EN, function(month) {
        var singlemonth = $scope.yearRecords
        .filter(function(obj) {
          return !obj.income;
        })
        .filter(function(obj) {
          return obj.month.substring(5,obj.month.split('').length) === month;
        });
        $scope.recordsyear = $scope.recordsyear.concat($filter('arrangeRecords')(singlemonth,'name'))
        .map(function(obj) {
          obj.value = parseInt(obj.value);
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
     
      }

    if($rootScope.period === 'week') {
      $scope.weekRecords = $rootScope.AllRecords.filter(function(item) {
        return (item.week === $rootScope.selection.week);
      });
      if($scope.weekRecords.length !== 0) {
         $scope.records = $filter('arrangeRecords')($scope.weekRecords, 'name');
         $scope.labels = $filter('getFromList')($scope.records);
         $scope.weekRecords.sort(function(a,b) {
            return new Date(a.dayDate).getTime() - new Date(b.dayDate).getTime();
         });
         _.forEach($scope.weekRecords, function(obj) {
          obj.dayDate = $translate.instant(moment(obj.dayDate).format('ddd'));
         });
      $scope.barData = [{
        key:'Cumulative Return',
        values:$scope.weekRecords.filter(function(item) {
          return !item['income'];
        })
        .map(function(obj) {
          obj.value = parseInt(obj.value);
            return obj;
          })
        }]; 
        $scope.barOptions = barChart($scope.barData, 'dayDate');
      }
     
      }
      if($rootScope.period === 'day') {
        if($scope.dayRecords.length !== 0) {
          $scope.dayRecords = $scope.AllRecords.filter(function(item) {
          return (item.dayDate === $rootScope.selection.date);
        });
        $scope.records = $filter('arrangeRecords')($scope.dayRecords, 'name');
        $scope.labels = $filter('getFromList')($scope.records);
         
        $scope.barData = [{
          key:'Cumulative Return',
          values:$scope.dayRecords
          }];
          $scope.barOptions = barChart($scope.barData, 'day');
        }
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

  calc();



}]);