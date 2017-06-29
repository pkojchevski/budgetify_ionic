angular.module('myApp.config',[]).
  constant('INCOMES', 
  	 [{"name": "salary", "income": true, "img": "img/salary.png"},
  	  {"name": "bonus", "income": true, "img": "img/bonus.png"},
  	  {"name": "savings", "income": true, "img": "img/savings.png"}
  	  ]).
  constant('LOCALES', 
		{
		  'fr-fr':'French',
          'en-us':'US',
          'pl-pl':'Poland',
          'mk-mk':'Macedonia',
          'en-gb':'Great Britain',
          'de-de':'Germany'
		})
	.constant('WEEKS_LIST', ["week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])

	.constant('MONTHS_LIST_EN', ["January", "February", "March", "April", "May", "June", "July", "August", "September",
 "October", "November", "December"])

    .constant('MONTHS_LIST_PL', ['styczen','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpien','wrzesien',
                  'pażdziernik','listopad','grudzien'])

	.constant('MONTHS_LIST_MK', ['јануари','февруари','март','април','мај','јуни','јули','август','септември',
                  'октомври','новемри','декември'])

	.constant('ROWS', [0, 7, 14, 21, 28, 35])

	.constant('COLUMNS', [0, 1, 2, 3, 4, 5, 6]);



 