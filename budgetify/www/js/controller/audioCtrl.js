angular.module("myApp.controllers")
.controller("audioCtrl",['$scope','$cordovaMedia','$rootScope','$timeout','$state', '$filter', 'superlogin', '$log',
   'MONTHS_LIST_EN', 'dbService', '$ionicModal', '$translate', '$localStorage','$locale','tmhDynamicLocale', 
  function($scope, $cordovaMedia, $rootScope, $timeout, $state, $filter, superlogin, $log, MONTHS_LIST_EN, 
    dbService, $ionicModal, $translate, $localStorage, $locale, tmhDynamicLocale) {

$rootScope.locale = $localStorage.locale || 'en-us';
tmhDynamicLocale.set($rootScope.locale);
$translate.use($rootScope.locale);
//moment.lang($rootScope.locale);

$rootScope.selectedDate = $rootScope.selectedDate || moment().lang($rootScope.locale).format('YYYY-MMM');

$scope.setRecordName = function(name) {
   $timeout(function() {
   	$rootScope.$broadcast('setRecordName', {recordName:name});
   },200);
}

$scope.logout = function() {
	superlogin.logout();
	$state.go('login');
}

$rootScope.syncStatus = {};

    // Logout if we don't have credentials to access the database
    $rootScope.$on('pm:error', function(event, db, err, status) {
      console.log('pm:error:'+status);
      $scope.$apply(function() {
         console.log('pm:error:'+status);
        $rootScope.syncStatus = status;
        if(err.error === 'unauthorized') {
          superlogin.logout('Session expired');
        }
      });
    });

 $scope.months =  [{'monthname':"January"}, {'monthname':"February"}, {'monthname':"March"}, {'monthname':"April"},
 {'monthname': "May"}, {'monthname':"June"}, {'monthname':"July"}, {'monthname':"August"}, {'monthname':"September"},
 {'monthname':"October"}, {'monthname':"November"}, {'monthname': "December"}];


 $rootScope.locales = {
  'en-us':'US',
  'pl-pl':'Poland',
  'mk-mk':'Macedonian'
}

$rootScope.changeLocale = function(locale) {
   $localStorage.locale = locale;
   moment.lang(locale);
   $rootScope.locale = locale;
   $rootScope.selectedDate = null;
   tmhDynamicLocale.set(locale);
   $translate.use(locale); 
   $state.go($state.current, {}, {reload: true});
}

$rootScope.current = {
    month:moment().lang('en-us').format('MMMM'),
    month_locale:moment().lang($rootScope.locale).format('MMMM'),
    monthNumber:moment().format('MM'),
    year:moment().format('YYYY'),
    date:moment().format('YYYY-MM-DD'),
    day:moment().format('DD'),
    firstDay: moment().startOf('month').format('D'),
    firstDayDate: moment().startOf('month').lang('en').format('ddd'),
    lastDay:moment().endOf('month').format('DD'),
    week:moment().isoWeek(),
    firstWeek:moment().startOf('month').isoWeek(),
    lastWeek:moment().endOf('month').isoWeek()
}

$rootScope.selection = $rootScope.selection || angular.copy($scope.current);

$scope.monthsList = angular.copy($scope.months);


 $scope.categories = [{"name": "salary","img": "img/salary.png"},
  	  {"name": "bonus", "img": "img/bonus.png"},
  	  {"name": "savings", "img": "img/savings.png"},{"name": "home", "img": "img/home.png"},
      {"name": "communications", "img": "img/communications.png"},
      {"name": "health", "img": "img/health.png"},
      {"name": "groceries", "img": "img/groceries.png"},
      {"name": "transport", "img": "img/transport.png"},
      {"name": "clothes", "img": "img/clothes.png"},
      {"name": "entertainment", "img": "img/entertainment.png"},
      {"name": "toys", "img": "img/toys.png"},
      {"name": "cigarettes", "img": "img/cigarettes.png"},
      {"name": "restaurants", "img": "img/restaurants.png"},
      {"name": "bills", "img": "img/bills.png"},
      {"name": "education", "img": "img/education.png"},
      {"name": "other", "img": "img/other.png"},
      {"name": "car", "img": "img/car.png"},
      {"name": "credit", "img": "img/credit.png"},
      {"name": "insurance", "img": "img/insurance.png"},
      {"name": "electronics", "img": "img/electronics.png"}];

   _.forEach($scope.category, function(value, key) {
      value.name = $translate.instant(value.name);
   });
   $scope.categoryList = angular.copy($scope.categories);

$ionicModal.fromTemplateUrl('templates/months_compared.html', {
     scope: $scope,
     animation: 'slide-in-up',
}).then(function(modalMonth) {
      $scope.modalMonth = modalMonth;
   });

$scope.openMonthsModal = function() {
	$scope.modalMonth.show();
}

$scope.closeMonthsModal = function() {
	$scope.modalMonth.hide();
    $scope.firstMonth = {};
    $scope.secondMonth = {};
    $scope.monthOne = [];
    $scope.monthTwo = [];
 }

$ionicModal.fromTemplateUrl('templates/category_compared.html', {
     scope: $scope,
     animation: 'slide-in-up',
}).then(function(modalCategory) {
      $scope.modalCategory = modalCategory;
   });

$scope.openCategoryModal = function() {
	$scope.modalCategory.show();
}

$scope.closeCategoryModal = function() {
	$scope.modalCategory.hide();
	$scope.categoryComparison = [];
	$scope.categoryByYear = [];

 }

$scope.monthSelected = function(m1) {
$scope.firstMonth = m1;
}

$scope.comparedMonth = function(m1, m2) {
  $scope.secondMonth = m2;
  $scope.openMonthsModal();
  dbService.getRecordsForMonth('month'+m1.monthname).then(function(result) {
  	$scope.monthOne = $filter('arrangeRecords')(result,'name');
  	return dbService.getRecordsForMonth('month'+m2.monthname).then(function(result) {
       $scope.monthTwo = $filter('arrangeRecords')(result,'name');
       $scope.comparedList = $filter('compare')($scope.monthOne,$scope.monthTwo);
  	});
  }).catch(function(error) {
   console.log('error:'+error);
  });
}

$scope.compareCategory = function(category) {
	$scope.selectedCategory = category;
	$scope.openCategoryModal();
    dbService.getRecordsForYear($rootScope.selection.year).then(function(result) {
  	  $scope.categoryByYear = $filter('extractCategory')(result, category);
  	  // console.log('categoryByYear:'+JSON.stringify($scope.categoryByYear));
  	  $scope.categoryComparison = $filter('arrangeRecords')($scope.categoryByYear,'month');
    });
}

}]);
