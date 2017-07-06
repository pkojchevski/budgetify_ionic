// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('myApp', ['ionic','ngCordova','myApp.controllers',
  'myApp.services','myApp.filters','myApp.directives','nvd3','pascalprecht.translate','tmh.dynamicLocale',
  'ngStorage','myApp.config','superlogin','pouchMirror','angular-loading-bar','mdo-angular-cryptography',
  'ngMessages','cfp.loadingBar']).constant('_',window._);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // if(window.Connection) {
    //   console.log('navigator.connection.type:'+navigator.connection.type);
    //   console.log('window.navigator.onLine'+window.navigator.onLine);
    //   if(navigator.connection.type === Connection.NONE) {
    //   window.addEventListener("offline", function () {
    //     $rootScope.online = false;
    //     console.log('online');
    //     $rootScope.$broadcast('offline');
    // });     
    //   } else {
    //   window.addEventListener("online", function () {
    //     $rootScope.online = true;
    //       console.log('offline');
    //     $rootScope.$broadcast('online');
    // });
    //   }
    // }
  });
});

app.config(['$logProvider', function($logProvider) {
   $logProvider.debugEnabled(true);
}]);

app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);

// app.config(['$cryptoProvider', function($cryptoProvider) {
//   //$cryptoProvider.setCryptographyKey('ABCD123');
//     $cryptoProvider.setCryptographyKey('ABCD123');
// }]);

// app.config(function($ionicConfigProvider) {
//   $ionicConfigProvider.scrolling.jsScrolling(false);
// });

app.config(['$translateProvider','$translatePartialLoaderProvider'
  ,function($translateProvider) {
  $translateProvider
  // .useStaticFilesLoader({
  //   prefix:"/static-translations/",
  //   sufix:".json"
  // })
    .preferredLanguage('en-us')
    .useMissingTranslationHandlerLog()
    .fallbackLanguage('en-us')
    .useSanitizeValueStrategy('escape')
    // .useLoader('$translatePartialLoader', {
    //   urlTemplate:'../../translations/{lang}/{part}.json'
    // });
    .translations('en-us', {
  'January':'January',
  'February':'February',
  'March':'March',
  'April':'April',
  'May':'May',
  'June':'June',
  'July':'July',
  'August':'August',
  'September':'September',
  'October':'October',
  'November':'November',
  'December':'December',
  'salary':'salary',
  'bonus':'bonus',
  'savings':'savings',
  'education':'education',
  'groceries':'groceries',
  'bills':'bills',
  'home':'home',
  'clothes':'clothes',
  'insurance':'insurance',
  'other':'other',
  'health':'health',
  'car':'car',
  'entertainment':'entertainment',
  'electronics':'electronics',
  'restaurants':'restaurants',
  'transport':'transport',
  'cigarettes':'cigarettes',
  'credit':'credit',
  'communications':'communications',
  'toys':'toys',
  'title':'Settings',
  'currency':'currency',
  'language':'Language ',
  'mydate':'{{$rootScope.selectedDate}}',
  "week":"week",
   "Mon":"Mon",
  "Tue":"Tue",
  "Wed":"Wed",
  "Thu":"Thu",
  "Fri":"Fri",
  "Sat":"Sat",
  "Sun":"Sun",
  'addDetails':'...add details',
  'income':'Income',
  'expenses':'Expenses',
  'selectIncome':'Select Income',
  'selectExpense':'Select Expense',
  'selectedDate':'{{date}}',
  'today':'Today',
  'thisweek':'This Week',
  'thismonth':'This Month',
  'thisyear':'This Year',
  'Login':'Login',
  'Logout':'Logout',
  'compare_month':'Compare months',
  'compare_categories':'Compare categories',
  'Category':'Category',
  'select_month':'Select month',
  'compare_with_month':'Compare with months',
  'compare_categories':'Compare category',
  'French':'French',
  'US':'English',
  'Poland':'Polish',
  'Macedonian':'Macedonian',
  'German':'German',
  'Username':'Username',
  'Password':'Password',
  'Register':'Register',
  'Name':'Name',
  'Username':'Username',
  'Email':'Email',
  'Confirm Password':'Confirm password',
  'Please add username':'Please add username',
  "Sorry, can't let you in without a password.":"Sorry, can't let you in without a password.",
  'At least 6 characters required.':'At least 6 characters required.',
  'Required.':'Required.',
  'No more than 16 characters.':'No more than 16 characters.',
  'Illegal characters detected.':'Illegal characters detected.',
  'Username is already taken.':'Username is already taken.',
  'Not a valid email.':'Not a valid email.',
  'Email is already in use.':'Email is already in use.',
  'The Passwords do not match.':'The Passwords do not match',
  'SignUp':'SignUp',
  'encryptionKey':'encryption key'
    })
    .translations('pl-pl', {
  'January':'styczen',
  'February':'luty',
  'March':'marzec',
  'April':'kwiecień',
  'May':'maj',
  'June':'czerwiec',
  'July':'lipiec',
  'August':'sierpien',
  'September':'wrzesien',
  'October':'pażdziernik',
  'November':'listopad',
  'December':'grudzien',
  'salary':'pensja',
  'bonus':'bonus',
  'savings':'oszczędności',
  'education':'edukacja',
  'groceries':'zakupy',
  'bills':'rachunki',
  'home':'dom',
  'clothes':'ubrania',
  'insurance':'ubezpieczenie',
  'other':'inne',
  'health':'zdrowie',
  'car':'samochód',
  'entertainment':'zabawa',
  'electronics':'elektronika',
  'restaurants':'resturacja',
  'transport':'transport',
  'cigarettes':'papierosy',
  'credit':'kredyt',
  'communications':'komunikacja',
  'toys':'zabawki',
  'title':'Ustawienia',
  'currency':'waluta',
  'language':'Język ',
  'mydate':'{{$rootScope.selectedDate}}',
  "week":"tydz.",
   "Mon":"Pon",
  "Tue":"Wto",
  "Wed":"Śro",
  "Thu":"Czw",
  "Fri":"Pią",
  "Sat":"Sob",
  "Sun":"Nie",
  'addDetails':'...dodaj szczegóły',
  'income':'Dochód',
  'expenses':'Wydatki',
  'selectIncome':'Wybierz Dochód',
  'selectExpense':'Wybierz Wydatek',
  'selectedDate':'{{date}}',
  'today':'Dzisiaj',
  'thisweek':'Ten tydzień',
  'thismonth':'Ten miesięc',
  'thisyear':'Ten Rok',
  'Login':'Logowanie',
  'Logout':'Wyloguj',
  'compare_month':'Porównanie miesiące',
  'compare_categories':'Porównanie kategorie',
  'Category':'Kategoria',
  'select_month':'Wybierz miesięc',
  'compare_with_month':'Porównaj z miesięca',
  'compare_categories':'Porównaj kategorie',
  'French':'Francuski',
  'US':'Angielski',
  'Poland':'Polski',
  'Macedonian':'Macedonski',
  'German':'Niemecki',
  'Username':'Użytkownik',
  'Password':'Hasło',
  'Register':'Rejestracija',
  'Name':'Imię',
  'Email':'Email',
  'Confirm Password':'Powtórz hasło',
  'Please add username':'Proszę uzupelnić użytkownika',
  "Sorry, can't let you in without a password.":"Proszę uzupelnić hasło.",
  'At least 6 characters required.':'Minimum 6 litery potrzebnie.',
  'Required.':'Wymaganę.',
  'No more than 16 characters.':'Nie więcej niż 16 litery.',
  'Illegal characters detected.':'Wykryto nielegalne znaki.',
  'Username is already taken.':'Nazwa użytkownika jest już zajęta.',
  'Not a valid email.':'Nieprawidłowy e-mail.',
  'Email is already in use.':'Adres e-mail jest już w użyciu.',
  'The Passwords do not match.':'Hasła nie pasują.',
  'SignUp':'Zarejestruj',
  'encryptionKey':'Klucz szyfrowania'
    })
    .translations('mk-mk', {
  'January':'јануари',
  'February':'февруари',
  'March':'март',
  'April':'април',
  'May':'мај',
  'June':'јуни',
  'July':'јули',
  'August':'август',
  'September':'септември',
  'October':'октомври',
  'November':'новемри',
  'December':'декември',
  'salary':'плата',
  'bonus':'бонус',
  'savings':'заштеда',
  'education':'едукација',
  'groceries':'намирници',
  'bills':'сметки',
  'home':'дом',
  'clothes':'облека',
  'insurance':'осигурување',
  'other':'друго',
  'health':'здравје',
  'car':'автомобил',
  'entertainment':'забава',
  'electronics':'електроника',
  'restaurants':'ресторани',
  'transport':'транспорт',
  'cigarettes':'цигари',
  'credit':'кредит',
  'communications':'комуникации',
  'toys':'играчки',
  'title':'Подесување',
  'currency':'валута',
  'language':'јазик ',
  'mydate':'{{$rootScope.selectedDate}}',
  "week":"нед.",
   "Mon":"Пон",
  "Tue":"Вто",
  "Wed":"Сре",
  "Thu":"Чет",
  "Fri":"Пет",
  "Sat":"Саб",
  "Sun":"Нед",
  'addDetails':'...детали',
  'income':'Приход',
  'expenses':'Трошоци',
  'selectIncome':'Избери приход',
  'selectExpense':'Избери трошок',
  'selectedDate':'{{date}}',
  'today':'Денес',
  'thisweek':'Оваа недела',
  'thismonth':'Овој месец',
  'thisyear':'Оваа година',
  'Login':'Логирање',
  'Logout':'Одјавување',
  'compare_month':'спореди месеци',
  'compare_categories':'спореди категории',
  'Category':'Категорија',
  'select_month':'Избери месец',
  'compare_with_month':'Спореди со месец',
  'compare_categories':'Спореди категорија',
  'French':'Француски',
  'US':'Англиски',
  'Poland':'Полски',
  'Macedonian':'Македонски',
  'German':'Германски',
  'Username':'Корисничко име',
  'Password':'Лозинка',
  'Register':'Регистрација',
  'Name':'Име',
  'Email':'Емаил',
  'Confirm Password':'Повтори ја лозинката',
  'Please add username':'Запиши корисник',
  "Sorry, can't let you in without a password.":"Мораш да пополниш лозинка.",
  'At least 6 characters required.':'Минимум 6 карактери се потребни.',
  'Required.':'Задолжително.',
  'No more than 16 characters.':'Не повеќе од 16 карактери.',
  'Illegal characters detected.':'Детектирани илегални карактери.',
  'Username is already taken.':'Корисничкото име е зафатено.',
  'Not a valid email.':'Не валиден емаил.',
  'Email is already in use.':'Емаил е веќе во употреба.',
  'The Passwords do not match.':'Лозинките не се совпаѓаат.',
  'SignUp':'Регистрација',
  'encryptionKey':'клуч за кодирање'
    });
}]);

app.config(function(superloginProvider) {
  var nodeurl = 'https://murmuring-garden-66915.herokuapp.com/auth/';
  //var nodeurl = 'http://192.168.0.101:3000/auth/';
  //var nodeurl = 'http://localhost:3000/auth/'
  var superloginConfig = {
      baseUrl: nodeurl,
      checkExpired: 'stateChange',
      // providers: ['facebook', 'google', 'github', 'windowslive', 'linkedin']
      providers: []
    };
    superloginProvider.configure(superloginConfig);
});

app.config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern(
      'lib/angular-i18n/angular-locale_{{locale}}.js');
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'LoginCtrl'
  })
    .state('list',
    {
      cache:false,
      url:'/list',
      templateUrl:'templates/list.html',
      controller:'listController',
    })
    .state('chart',
    {
      cache:false,
      url:'/chart',
      templateUrl:'templates/chart.html',
      controller:'chartCtrl',
    })
    .state('expensesRecord',
    {
      cache:false,
      url:'/expensesRecord',
      templateUrl:'templates/addRecord.html',
      params: {'title':'Expense'},
      controller:'inputController',
    })
     .state('incomeRecord',
    {
      cache:false,
      url:'/incomeRecord',
      templateUrl:'templates/addRecord.html',
      params: {'title':'Income'},
      controller:'inputController',
    })
    .state('calendar',
    {
      cache:false,
      url:'/calendar',
      templateUrl:'templates/calendar.html',
      controller:'calendarController',
    });
    $urlRouterProvider.otherwise('list');
});


app.run(function($rootScope, $state, superlogin) {
   $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
   if(!superlogin.authenticated()) {
    if(next.name !== 'login') {
      event.preventDefault();
      $state.go('login');
    }
   }
});
});

