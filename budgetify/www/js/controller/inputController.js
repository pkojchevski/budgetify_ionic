angular.module("myApp.controllers")
.controller("inputController",["$ionicPlatform", "$rootScope", "$scope","$filter","$ionicModal", "$log", "$state", "$timeout",
  "shareObjects", "$cordovaMedia",'INCOMES','MONTHS_LIST_EN', 'MONTHS_LIST_MK', 'MONTHS_LIST_PL',
  'EXPENSES', 'dbService', 'setDatesFromDay', 'setDatesfromWeek', '$stateParams',
  function($ionicPlatform, $rootScope, $scope, $filter, $ionicModal, $log, $state,
   $timeout, shareObjects, $cordovaMedia, INCOMES, MONTHS_LIST_EN, MONTHS_LIST_MK, MONTHS_LIST_PL,
  EXPENSES, dbService, setDatesFromDay, setDatesfromWeek, $stateParams) {

$scope.ok = false;
$scope.ok1 = false;
$scope.animated = false;
$scope.edit = shareObjects.getEdit();

$scope.monthsList = MONTHS_LIST_EN;

$scope.title = $stateParams.title;

// // play sound cash.wav
// $scope.play = function(sound) {
//   //console.log('play:'+sound);
//   var media = $cordovaMedia.newMedia(sound);
//   media.play();
// }
 

//get input from list controller
$scope.selectedInput = shareObjects.getObject()[0] || null;
// console.log('selectedInput:'+JSON.stringify($scope.selectedInput));
// console.log('$scope.edit:'+$scope.edit);
if($scope.selectedInput) {
  //if edit is true, add value
   $scope.result = $scope.edit ? $scope.selectedInput.value : '';
   //if edit is true add details
   $scope.details = $scope.edit ? $scope.selectedInput.details : '';
}

//if there is input release update button 
if($scope.selectedInput) {
  $scope.ok = true;
  $scope.ok1 = true;
}

$scope.$on('setRecordName', function(events, recordName) {
  $log.debug('on');
   $scope.recordName = recordName.recordName;
   if($scope.recordName === 'incomes') {
   } else {
   }
});

$scope.incomes = INCOMES;
$scope.expenses = EXPENSES;

  $ionicModal.fromTemplateUrl('templates/incomesList.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modalIncome) {
      $scope.modalIncome = modalIncome;
   });

     $ionicModal.fromTemplateUrl('templates/expensesList.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modalExpense) {
      $scope.modalExpense = modalExpense;
   });

   $scope.openModal = function() {
     if($scope.recordName === 'income') {
      $scope.modalIncome.show();
     }
     if($scope.recordName === 'expenses') {
      $scope.modalExpense.show();
     }
   }

   $scope.closeModal = function() {
     if($scope.recordName === 'income') {
      $scope.modalIncome.hide();
     }
     if($scope.recordName === 'expenses') {
      $scope.modalExpense.hide();
     }
   }

$scope.selection = function(input) {
   var record = $filter('getRecordById')($rootScope.AllRecords, input.name, 
    new Date($rootScope.selection.date).toISOString());
       if(record.length !== 0) {
         $scope.selectedInput = record[0];
         $scope.result = $scope.selectedInput.value; 
         $scope.edit = true;
       } else {
        $scope.selectedInput = input;
        $scope.edit = false;
       }
       $scope.ok1 = true;
}

//save or update record
$scope.saveUpdateRecords = function(name, details) {
   if ($scope.edit) {
    var record = $scope.selectedInput;
    record.value = $scope.result.toString();
    record.details = details;
  } else {
    var record = {
      _id:$rootScope.selection.date+$scope.selectedInput.name,
      value:$scope.result,
      month:'month'+moment($rootScope.selection.date).lang('en').format('MMMM'),
      week:$rootScope.selection.week.toString(),
      year:$rootScope.selection.year.toString(),
      dayDate:$rootScope.selection.date.toString(),
      img:$scope.selectedInput.img,
      income:$scope.selectedInput.income,
      name:$scope.selectedInput.name,
      createdAt:new Date($rootScope.selection.date).toISOString(),
      details:$scope.selectedInput.details ? $scope.selectedInput.details + '; '+ details : details
    }
  }
  
  dbService.updateRecord(record);
  $scope.animated = true;
  
  $timeout(function() {
      $state.go('list',{},{reload:true});
  },300);
    $scope.selectedInput = null;
    $scope.result = '';
    $scope.details = '';
  };

  $scope.sign = false;

  $scope.myFunction = function(id) {
    if(!$scope.sign) {
     $scope.ok = true;
    }
  if(typeof $scope.result === 'undefined') {
    $scope.result = id;
  } else {
    $scope.result = $scope.result+id;
    $log.debug('button clicked');
  }
  };

  $scope.delete = function() {
    $scope.result='';
  };

//calculations
$scope.plus = function(result) {
  $scope.result = result +' + ';
    $scope.ok = false;
    $scope.sign = true;
}

$scope.minus = function(result) {
  $scope.result = result + ' - ';
  $log.debug('minus clicked');
    $scope.ok = false;
    $scope.sign = true;
}

$scope.equal = function(result) {
  var suma = 0;
  var arr = result.split(' ');
for(var i = 0; i < arr.length/2; i ++) {
  if(arr[2*i+1] === '-') {
    arr[2*i+2] = '-' + arr[2*i+2];
  }
}
for(var i = 0; i < arr.length/2; i ++) {
  $log.debug('parseInt(arr[2*i]):'+parseInt(arr[2*i]));
    suma = suma + parseInt(arr[2*i]);
}
$scope.result = suma;
  $scope.ok = true;
}

$ionicModal.fromTemplateUrl('templates/ionic-datepicker-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modalCal) {
      $scope.modalCal = modalCal;
   });

$scope.openDatePickerCalendar = function() {
  $log.debug('modal calendar clicked');
  $scope.modalCal.show();
}

$scope.closeIonicDatePickerModal = function() {
  $scope.modalCal.hide();
}

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
  $rootScope.dayList = $filter('getDays')(1, $rootScope.selection.lastDay, $rootScope.weeksList, $rootScope.selection.firstDayDate);
  $rootScope.selection.firstWeek = moment([$rootScope.selection.year, monthNumber-1]).startOf('month').isoWeek();
  $rootScope.selection.lastWeek = moment([$rootScope.selection.year, monthNumber-1]).endOf('month').isoWeek();
  $scope.weekList = $filter('getWeeks')($rootScope.selection.firstWeek, $rootScope.selection.lastWeek);
  // $rootScope.selectedDate = $rootScope.selection.date;
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
  $rootScope.selection.monthNumber = (index === 12 ? 1 : index + 1);
  $scope.monthChanged($rootScope.selection.month, $rootScope.selection.monthNumber);
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

  $rootScope.selection.monthNumber = index+1;
  $scope.monthChanged($rootScope.selection.month, $rootScope.selection.monthNumber);
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
  $rootScope.selection.month = moment($rootScope.selection.date).month();
  $log.info('month:'+$rootScope.selection.month);
  // var index = $scope.monthsList.indexOf($rootScope.selection.month);
  // $rootScope.selection.monthNumber = index + 1;
  // $rootScope.selection.firstDayDate = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').format('ddd');
  // $rootScope.selection.lastDate = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').format('DD');
  // $scope.dayList = $filter('getDays')(1, $rootScope.selection.lastDay, $scope.weeksList, $rootScope.selection.firstDayDate);
  // $rootScope.selection.firstWeek = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).startOf('month').isoWeek();
  // $rootScope.selection.lastWeek = moment([$rootScope.selection.year, $rootScope.selection.monthNumber-1]).endOf('month').isoWeek();
  // $scope.weekList = $filter('getWeeks')($rootScope.selection.firstWeek, $rootScope.selection.lastWeek);
}


$scope.setweek = function() { 
  $rootScope.selectedDate = $rootScope.selection.week;
  $rootScope.period = 'week';
  // console.log('week:'+$rootScope.selection.week);
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
