angular.module("myApp.directives",[]).
directive('expensesList', function() {
  return {
    restrict:'E',
    transclude:true,
    templateUrl:'templates/expenses.html',
    link:function(scope, elem, attr) {

  }
}
}).
directive('animateModelChange', ['$timeout', function($timeout) {
	return {
	restrict:'A',
	link:function(scope, elem, attrs) {
		function modelChanged(newVal, oldVal) {
		   var changeClass = null;
		   var timer = null;
		   var animateClass = 'animateClass';

		if(timer){
          $timeout.cancel(timer);
          timer = null;
      }
			if(newVal && newVal !== oldVal) {
				changeClass = animateClass;
			}
		  elem.addClass(changeClass);

		  timer = $timeout(function removeClasses(){
          elem.removeClass(animateClass);
      }, 200);

		}

    scope.$watch(function() {return attrs.model}, modelChanged);
	}
}
}])

.directive('checkUsername', function($q, superlogin) {
	return {
		require:'ngModel',
		link:function(scope, elem, attr, model) {
			model.$asyncValidators.checkUsername = function(modelValue) {
				if(model.$isEmpty(modelValue)) {
					return $q.when();
				}
				return superlogin.validateUsername(modelValue);
			}
		}
	}
})

.directive('checkEmail', function($q, superlogin) {
    return {
       require:'ngModel',
       link:function(scope, elem, attr, model) {
       	model.$asyncValidators.checkEmail = function(modelValue) {
       		if(model.$isEmpty(modelValue)) {
       			return $q.when();
       		}
       		return superlogin.validateEmail(modelValue);
       	}
       }
    }
})

.directive('matches', function() {
   return {
   	require:'ngModel',
   	scope: {
      otherModelValue:'=matches'
   	},
   	link:function(scope, elem, attr, model) {
   		model.$validators.matches = function(modelValue) {
          if(model.$isEmpty(modelValue)) {
          	return true;
          }
        return modelValue == scope.otherModelValue;
   		}
   		scope.$watch('otherModelValue', function() {
   			model.$validate();
   		});
   	}
   }
})

.directive('pkActivate', ['$rootScope', '$state',
function($rootScope, $state) {
	return {
      link: function(scope, elem, attr) {
        var oldEl, newEl;
				 $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
						oldEl = document.getElementsByClassName(from.name);
						angular.element(oldEl).removeClass('mdi-dark');
						newEl = document.getElementsByClassName(to.name);
						angular.element(newEl).addClass('mdi-dark');
        });
	  }
	}
}]);