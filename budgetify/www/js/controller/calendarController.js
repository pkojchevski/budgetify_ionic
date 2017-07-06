angular.module('myApp.controllers').
controller('calendarController', ['$scope','$rootScope','$filter', 'MONTHS_LIST_EN', 'MONTHS_LIST_PL', 
  'MONTHS_LIST_MK', '$log', '$timeout', 'setDatesfromWeek', 'setDatesFromDay',
  function($scope, $rootScope, $filter, MONTHS_LIST_EN, MONTHS_LIST_PL, MONTHS_LIST_MK, $log, $timeout,
    setDatesfromWeek, setDatesFromDay) {

$scope.monthsList_EN = MONTHS_LIST_EN;

if($rootScope.locale === 'mk-mk') {
  $scope.monthsList = MONTHS_LIST_MK;
}
if($rootScope.locale === 'en-us') {
  $scope.monthsList = MONTHS_LIST_EN;
}
if($rootScope.locale === 'pl-pl') {
  $scope.monthsList = MONTHS_LIST_PL;
}

$scope.monthChanged = function(month) {
  var monthNumber = monthNumber = $filter('findMonthIndex')(month)+1;
  $rootScope.selection.monthNumber = monthNumber;
  $rootScope.selection.month = month;
  $rootScope.selection.date = moment([$rootScope.selection.year, monthNumber-1]).format('YYYY-MM-DD');
  $rootScope.selection.firstDayDate = moment([$rootScope.selection.year, monthNumber-1]).lang('en').startOf('month').format('ddd');
  $rootScope.selection.lastDay = moment([$rootScope.selection.year, monthNumber-1]).endOf('month').format('DD');
  $rootScope.selection.firstWeek = moment([$rootScope.selection.year, monthNumber-1]).startOf('month').isoWeek();
  $rootScope.selection.lastWeek = moment([$rootScope.selection.year, monthNumber-1]).endOf('month').isoWeek();
  $rootScope.weekList = $filter('getWeeks')($rootScope.selection.firstWeek, $rootScope.selection.lastWeek);
  $rootScope.dayList = $filter('getDays')(1, $rootScope.selection.lastDay, $rootScope.weeksList, $rootScope.selection.firstDayDate);
}
 
$scope.prevMonth = function() {
  var index = $scope.monthsList.indexOf($rootScope.selection.month_locale);
  if(index === 0) { 
    index = 11;
  } else {
    index--;
  }
  $rootScope.selection.month_locale = $scope.monthsList[index];
  $rootScope.selection.month = $scope.monthsList_EN[index];
  // $rootScope.selection.monthNumber = (index === 12 ? 1 : index + 1);
  $scope.monthChanged($rootScope.selection.month);
}

$scope.nextMonth = function() {
  var index = $scope.monthsList.indexOf($rootScope.selection.month_locale);
  if(index === 11) {
    index=0;
  } else {
    index++;
  }
  $rootScope.selection.month = MONTHS_LIST_EN[index];
  $rootScope.selection.month_locale = $scope.monthsList[index];

  // $rootScope.selection.monthNumber = index+1;
  $scope.monthChanged($rootScope.selection.month);
}

$scope.yearChanged = function(year) {
  $rootScope.selection.year = year;
  var index = $scope.monthsList.indexOf($rootScope.selection.month);
  $rootScope.selection.month_locale = $scope.monthsList[index];
  $rootScope.selection.month = MONTHS_LIST_EN[index];
  $rootScope.selection.monthNumber = index+1;
  $rootScope.selection.date = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).format('YYYY-MM-DD');
  $rootScope.selection.firstDayDate = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').format('ddd');
  $rootScope.selection.lastDate = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').format('DD');
  $scope.dayList = $filter('getDays')(1, $rootScope.selection.lastDay, $scope.weeksList, $rootScope.selection.firstDayDate);
  $rootScope.selection.firstWeek = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').isoWeek();
  $rootScope.selection.lastWeek = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).endOf('month').isoWeek();
  $scope.weekList = $filter('getWeeks')($rootScope.selection.firstWeek, $rootScope.selection.lastWeek);
}

$scope.setday = function() { 
  $rootScope.selection.date = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1, $rootScope.selection.day]).format('YYYY-MM-DD');
  $rootScope.selectedDate = $rootScope.selection.date;
  $rootScope.period = 'day';
  $scope.selection.month = moment($scope.selection.date).lang('en').format('MMMM');
  var index = $scope.monthsList_EN.indexOf($scope.selection.month);
  $rootScope.selection.month_locale = $scope.monthsList[index];
}

$rootScope.clicked = {
  list:false,
  chart:false,
  plus:false,
  minus:false,
  calendar:true,
  hamburger:false
}

$scope.setweek = function() { 
  $rootScope.selectedDate = $rootScope.selection.week;
  $rootScope.period = 'week';
  setDatesfromWeek($rootScope.selection.week);
}

$scope.btntoday = function() { 
  $rootScope.selection.date = moment().format('YYYY-MM-DD');
  $rootScope.selectedDate = $rootScope.selection.date;
  $rootScope.period = 'day';
  setDatesFromDay($rootScope.selection.date);
}

$scope.btnthisweek = function() { 
  $rootScope.selection.week = moment().isoWeek();
  $rootScope.selectedDate = $rootScope.selection.week;
  $rootScope.period = 'week';
  setDatesfromWeek($rootScope.selection.week);
}

$scope.btnthismonth = function() { 
  $rootScope.selectedDate = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).format('YYYY-MMMM');
  $rootScope.period = 'month';
}

$scope.btnthisyear = function() { 
  $rootScope.selectedDate = $rootScope.selection.year;
  $rootScope.period = 'year';
}
 

}]);