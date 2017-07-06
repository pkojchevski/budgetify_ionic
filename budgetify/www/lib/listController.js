angular.module("myApp.controllers",[])
  .controller("listController", ["$rootScope","$scope","$filter","$interval", "$state","$window", 'shareObjects', 'barChart',
  'pieChart','$ionicModal', 'tmhDynamicLocale', '$locale','$localStorage',
  '$translate','$translatePartialLoader','$cordovaMedia', '$timeout','superlogin', '$ionicPlatform',
  'PouchMirror','dbService', '$crypto','cfpLoadingBar', '$log',
   function($rootScope, $scope, $filter, $interval, $state, $window,
  shareObjects, barChart, pieChart, $ionicModal, tmhDynamicLocale, $locale,
  $localStorage, $translate, $translatePartialLoader, $cordovaMedia, $timeout, 
  superlogin, $ionicPlatform, PouchMirror, dbService, $crypto, cfpLoadingBar, $log) {

if(!$rootScope.AllRecords) {
  $rootScope.AllRecords = [];
}

$scope.balanceCalc = false;
$rootScope.SyncStatus = {};

dbService.startSequence();

$rootScope.selectedDate = $rootScope.selectedDate || moment().format('YYYY-MMM');


$rootScope.weeksList = ["week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
$rootScope.rows = [0, 7, 14, 21, 28, 35];
$rootScope.cols = [0, 1, 2, 3, 4, 5, 6];
$rootScope.today = moment().format('DD');
$rootScope.weekList = $filter('getWeeks')($rootScope.selection.firstWeek, $rootScope.selection.lastWeek);
$rootScope.dayList = $filter('getDays')($rootScope.selection.firstDay, $rootScope.selection.lastDay,
                                           $rootScope.weeksList, $rootScope.selection.firstDayDate);
$rootScope.yearsList = $filter('getYears')(1900, 2100);   


//follow changes in db
dbService.forChange($rootScope.AllRecords);

//run this function at the begining
function updateRecords() {
  $log.info('updateRecords');
  if(typeof $rootScope.period === 'undefined') {
    getData('month', $rootScope.selectedDate);
   } else {
   getData($rootScope.period, $rootScope.selectedDate);
  }
}


$scope.called = false;


$scope.$on('$destroy', function() {
   if($scope.changes) {
    $scope.changes.cancel();
   }
});

$scope.ready = true;

$rootScope.$on('pm:update', function(event, localName, action, syncStatus) {
  $scope.$apply(function() {
    if(superlogin.authenticated()) {
      $rootScope.syncStatus = syncStatus;
    } else {
      $rootScope.syncStatus = {};
    }
      });
  if(action === 'active') {
        $log.info('active');
    cfpLoadingBar.start();
        $scope.ready = true;
  }
  
  if(action === 'ready') {
    // $scope.changes = dbService.changesListener(_.once(updateRecords));
    $log.info('ready');
    cfpLoadingBar.complete();
    $scope.ready = false;
    if(!$scope.called) {
      updateRecords();
      $scope.called = true;
    }
  }

  if(action === 'paused') {
    // if($scope.ready) {
    //  $scope.changes = dbService.changesListener(_.once(updateRecords));
    // }
    $log.info('paused');
    if(!$scope.called) {
      updateRecords();
      $scope.called = true;
    }
   cfpLoadingBar.complete();
  }
});

    // Logout if we don't have credentials to access the database
  $rootScope.$on('pm:error', function(event, db, err, status) {
      $scope.$apply(function() {
        $rootScope.syncStatus = status;
        if(err.error === 'unauthorized') {
          superlogin.logout('Session expired');
        }
      });
    });


$scope.$on('$destroy', function() {
   if($scope.changes) {
    $scope.changes.cancel();
   }
});

shareObjects.deleteObject();

function getData(period, selected) {
  if(period === 'month') {
    $scope.records = [];
    $rootScope.selectedDate = selected || moment().format('YYYY-MMMM');
    //$log.info('Allrecords3:'+JSON.stringify($rootScope.AllRecords));
    //  dbService.getRecordsForMonth('month'+moment(new Date($rootScope.selection.date).toISOString()).lang('en').format('MMMM')).
    //  then(function(records) {
    //  $rootScope.AllRecords = records;
    //  $scope.records = $filter('arrangeRecords')($rootScope.AllRecords,'name');
    //       }).catch(function(err) {
    //         $log.debug.bind(console);
    //       });
    var month = 'month'+ moment(new Date($rootScope.selection.date).toISOString()).lang('en').format('MMMM');
    $scope.monthRecords = $rootScope.AllRecords.filter(function(item) {
          return (item.month === month);
    });
    $scope.records = $filter('arrangeRecords')($scope.monthRecords, 'name');

}
  if(period === 'day') {
    $scope.records=[];
    $scope.dayRecords = $rootScope.AllRecords.filter(function(item) {
      return (item.dayDate === $rootScope.selection.date);
    });

    $scope.records = $filter('arrangeRecords')($scope.dayRecords, 'name');
    //  dbService.getRecordsForDay($rootScope.selection.date)
    //  .then(function(records) {
    //   $rootScope.AllRecords = records;
    //  $scope.records = $filter('arrangeRecords')($rootScope.AllRecords,'name');
    //  }).catch(function(err) {
    //   $log.debug.bind(console);
    //  });
  }

  if(period==='week') {
    $scope.records=[];
    $log.info('Allrecords3:'+JSON.stringify($rootScope.AllRecords));
    $log.info('week:'+$rootScope.selection.week);
    $scope.weekRecords = $rootScope.AllRecords.filter(function(item) {
      return (parseInt(item.week) === $rootScope.selection.week);
    });
    //$log.info('weekRecords:'+JSON.stringify($scope.weekRecords));
    $scope.records = $filter('arrangeRecords')($scope.weekRecords, 'name');
    // dbService.getRecordsForWeek($rootScope.selection.week).then(function(records) {
    //    $rootScope.AllRecords = records;
    //    $scope.records = $filter('arrangeRecords')($rootScope.AllRecords,'name'); 
    //  });
  }
  if(period==='year') {
    $scope.records=[];
    $rootScope.selectedDate = selected || moment().format('YYYY-MMMM');
    $scope.yearRecords = $rootScope.AllRecords.filter(function(item) {
          return (item.year === $rootScope.selection.year);
    });
    $scope.records = $filter('arrangeRecords')($scope.yearRecords, 'name');
    //  dbService.getRecordsForYear($rootScope.selection.year)
    //  .then(function(records) {
    //     $rootScope.AllRecords = records;
    //     $log.info('records in year:'+JSON.stringify(records));
    //  $scope.records = $filter('arrangeRecords')($scope.AllRecords,'name');
    //   });
  };
}

$scope.$on('$destroy', function() {
   if($scope.changes) {
    $scope.changes.cancel();
   }
});

//act on list item click
$scope.openItem = function(item) {
  shareObjects.deleteObject();
    var record = $filter('getRecordById')($rootScope.AllRecords, item.name, 
      new Date($rootScope.selection.date).toISOString());
     if(record.length !== 0) {
      shareObjects.addObject(record);
      shareObjects.setEditTrue();
    } else {
      shareObjects.addObject([item]);
      shareObjects.setEditFalse();      
    }
    if(item.income) {
    $timeout(function() {
      $rootScope.$broadcast('setRecordName', {recordName:'income'});
    },100);
    } else {
    $timeout(function() {
      $rootScope.$broadcast('setRecordName', {recordName:'expenses'});
   },100);
    }
    $state.go('record',{},{reload:true});
}

$scope.deleteItem = function(item) {
  dbService.deleteRecord(item).then(function() {
   //console.log('delete');
    });
} 

// } //for superlogin





  }]);
