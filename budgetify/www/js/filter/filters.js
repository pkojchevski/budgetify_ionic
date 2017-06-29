angular.module("myApp.filters", []).
filter('getFromList', function() {
  return function(arr) {
  var arr1 = [];
  var expense=0;
  var arr2=[];
  angular.forEach(arr, function(item, index) {
    if(!item['income']) {
      expense += parseInt(item['value']);
    }
  });
  //$log.info('income:'+income);
  angular.forEach(arr, function(item, index) {
    if(!item['income']) {
      item['percent'] = (item['value']/expense).toFixed(2);
      item.dayDate = moment(item.dayDate).format('ddd');
    arr1.push(item);
    }
  });
    return arr1.filter(function(item) {
      return item.income === false;
    });
  }
}).

filter('arrangeRecords', function() {
  return function(arr, text) {
    if(arr.length !== 0) {
    var arr1 = arr.reduce(function(o, cur) {
      // Get the index of the key-value pair.
              // console.log('acc:'+JSON.stringify(o));
      var occurs = o.reduce(function(n, item, i) {
        return (item[text] === cur[text]) ? i : n;
      }, -1);
      // If the name is found,
      if (occurs >= 0) {
        // append the current value to its list of values.
        o[occurs].value = parseInt(o[occurs].value) + parseInt(cur.value);
      // Otherwise,
      } else {
        // add the current item to o (but make sure the value is an array).
        var obj = {name: cur.name, value: cur.value, img:cur.img, details:cur.details,
        income:cur.income, _id:cur._id, createdAt:cur.createdAt,  
        dayDate:cur.dayDate, week:cur.week, year:cur.year, month:cur.month, _rev:cur._rev};
        o = o.concat([obj]);
      }
      //$log.info('o after concat:'+JSON.stringify(o));
      return o;
    }, []);
    // return arr1.sort(function(a,b) {
    //   return parseInt(b.value) - parseInt(a.value);
    // })
    // .sort(function(a, b) {
    //   return (a.income === b.income) ? 0 : a.income ? -1 : 1;
    // });
    var arrinc = arr1.filter(function(obj) {return obj.income}).sort(function(a,b){return b.value-a.value});
    var arrexp = arr1.filter(function(obj) {return !obj.income}).sort(function(a,b){return b.value-a.value});
    return arrinc.concat(arrexp);
  } else {
    return [];
  }
  }
})



.filter('getExpensesTot', function() {
  return function(arr) {
    if(arr.length !== 0) {
      var arr1 = arr.map(function(item) {
      if(!item.income) {
        return parseInt(item.value);
      } else {
        return 0;
      }
    })
    .reduce(function(a,b) {
      return parseInt(a)+parseInt(b);
    });
    return arr1;
}
}
})

.filter('getIncomeTot', function() {
  return function(arr) {
    if(arr.length !== 0) {
    var arr1 = arr.map(function(item) {
      if(item.income) {
        return parseInt(item.value);
      } else {
        return 0;
      }
    })
    .reduce(function(a,b) {
      return a+b;
    });
    return arr1;
  }
}
})
.filter('arrangeByDate', function() {
    return function(arr) {
      var exist = false;
      var arr1 = arr.
      filter(function(item) {
        if(!item.income) {
           exist = true;
        } 
        return exist;
      }).
      reduce(function(acc, cur) {
        var occurs = acc.reduce(function(n, item, i){
          return (item.createdAt === cur.createdAt) ? i : n;
        },-1);
        if (occurs >= 0 ) {
          acc[occurs].value = parseInt(acc[occurs].value) + parseInt(cur[occurs].value);
        } else  {
        var obj = {name:cur.name, value:cur.value, img:cur.img,
        income:cur.income, createdAt:cur.createdAt, month:cur.month, week:cur.month, year:cur.year,
        dayDate:cur.dayDate};
        acc = acc.concat([obj]);
      }
      return acc;
      },[]);
      return arr1;
    }
})

.filter('getWeeks', function() {
  return function(fw, lw) {
    var arr = [];
    if (fw > lw) {
       for (var i = fw; i < 53; i++) {
         arr.push(i);
       }
       for(var i = 1; i <= lw; i++) {
          arr.push(i);
       }
    } else {
       for(var i = fw; i <= lw; i++) {
      arr.push(i);
    }
    }
    return arr;
  }
})

.filter('getDays', function($log) {
  return function(fd, ld, wl, dl) {
    var arr = [];
    for(var i = fd; i <= ld; i++) {
      if(i <= 9) {
        i = '0'+i;
      }
      arr.push(i);
    }
    for(var i = 1; i < wl.indexOf(dl); i++) {
      arr.unshift('');
    }
    return arr;
  }
})

.filter('getYears', function() {
  return function(min, max) {
    var arr = [];
    for(var i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }
})

.filter('findRecordByName', function() {
  return function(arr) {
    var arr1 = arr.filter(function(item, i) {
          var exist = false;
          if(item.name === $scope.selectedIncome.name) {
               exist = true;
          }
            return exist;
        });
    return arr1;
  }
})

.filter('findMonthIndex', function() {
   return function(monthName) {
     monthsList=["January", "February", "March", "April", "May", "June", "July", "August", "September",
                 "October", "November", "December"];
    monthsListpl=['styczen','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpien','wrzesien',
                  'pażdziernik','listopad','grudzien'];
     monthsListmk=['јануари','февруари','март','април','мај','јуни','јули','август','септември',
                  'октомври','новемри','декември'];
   var index = monthsList.indexOf(monthName);
   if(index === -1) {
    index = monthsListpl.indexOf(monthName);
    if(index === -1) {
    index = monthsListmk.indexOf(monthName);
    }
   }
   return index;
 }
})

.filter('getByDates' , function() {
  return function(arr, begin, end) {
    var arr1 = arr.filter(function(item) {
      return (item.createdAt >= begin && item.createdAt <= end);
    });
    return arr1;
  }
})

.filter('getRecordById', function() {
  var arr1;
  return function(arr, name, date) {
    if(arr.length !== 0) {
    arr1 = arr.filter(function(item) {
        return item.createdAt === date && item.name === name;
      });
    return arr1;
    } else {
      return [];
    }

  }
})

.filter('getByDay', function() {
  return function(arr, day) {
    var arr1=[];
    arr1 = arr.filter(function(item) {
      // $log.info('item.createdAt:'+item.createdAt);
      return item.createdAt === day;
    });
    return arr1;
  }
})

.filter('compare', function() {
  return function(arr1,arr2) {
   arr1.concat(arr2);
  }
})

.filter('compare', function() {
  var arr = [];
  return function(arr1, arr2) {
     var arr = [];
     var nameexists = false;
   for (var i = 0; i < arr1.length; i++) {
     nameexists = false;
     var obj = {};
     obj.img = arr1[i].img;
     obj.name = arr1[i].name;
     obj.value = arr1[i].value;
     obj.monthOne = arr1[i].month;
     for (var j = 0; j < arr2.length; j++) {
        obj.monthTwo = arr2[j].month;
      if(obj.name === arr2[j].name) {
        obj.value2 = arr2[j].value;
        nameexists = true;
      }
     }
     if(!nameexists) {
        obj.value2 = 0;
     }
     obj.delta = obj.value - obj.value2;
     arr.push(obj);
   }
 return arr.sort(function(a,b) {
     return b.delta - a.delta;
 });
}
})

.filter('extractCategory', function() {
  return function(arr, cat) {
    var arr1=[];
     return arr.filter(function(obj) {
        return obj.name === cat.name;
     });
  }
})

.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
        var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = currency(amount, symbol);
            return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
        }
    }])

.filter('cumulativeValues', function() {
  return function(arr) {
    for(var i = 0; i < arr.length-2; i++) {
      if(arr[i+1].week === arr[i].week) {
        arr[i+1].value = arr[i].value+arr[i+1].value;
      }
    }
    return arr;
  }
});


