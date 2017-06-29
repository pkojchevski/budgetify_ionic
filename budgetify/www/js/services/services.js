var services = angular.module("myApp.services",[]);
 var nodeurl = 'https://young-woodland-85394.herokuapp.com';
 //var nodeurl = 'http://localhost:3000';

services.factory('shareObjects', function(superlogin, $log) {
  var objList = [];
  var edit = false;

  var addObject = function(obj) {
     objList = [];
    objList.push(obj[0]);
  }

  var setEditFalse = function() {
    edit = false;
  }

  var setEditTrue = function() {
    edit = true;
  }

  var getEdit = function() {
    return edit;
  }
 
  var getObject = function() {
    return objList;
  }

  var deleteObject = function() {
    objList = [];
    $log.debug('object deleted');
  }

  return {
    addObject:addObject,
    getObject:getObject,
    deleteObject:deleteObject,
    getEdit:getEdit,
    setEditTrue:setEditTrue,
    setEditFalse:setEditFalse
  }
});

services.factory('barChart', function() {
   return function(data,what) {
      return {
            chart: {
                type: 'discreteBarChart',
                stacked:'false',
                height: 400,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d[what];},
                y: function(d){return d.value;},
                showControls:true,
                showValues: false,
                valueFormat: function(d){
                    return 'PLN' + d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: ''
                },
                yAxis: {
                    axisLabel: '',
                    axisLabelDistance: -10
                },
              useInteractiveGuideline: false,
              interactive: true,
              tooltip: {
                contentGenerator: function(d) { return "<img style='height:30px;width:30px' src="+d.data.img+">"; }
             }
           
              }
      }
        };
    });


services.factory('pieChart', function($translate) {
   return function() {
    return {
        chart: {
          type: 'pieChart',
          height: 400,
          donut: false,
          x: function(d){return d.name;},
          y: function(d){return d.percent;},
          showLabels: true,
          duration:500,
          showValues:true,
          showLegend: true,
          labelType: 'percent',
          labelTreshold:0.01,
          labelSunbeamLayout:true,
          valueFormat: function(d) {
              return d3.format('%')(d);
              },
          duration: 500,
          useInteractiveGuideline: false,
          interactive: true,
          tooltip: {
            contentGenerator: function(d) { return "<img style='height:30px;width:30px' src="+d.data.img+">"; }
          }
                }
        }; 
    }
});

services.factory('dbService', function($rootScope, $q, $crypto, superlogin, PouchMirror, 
  $timeout, $log, _, $localStorage, $filter) {
  var localDB;
  var remoteDB;
  var records = [];

  function startSequence() {
      var remoteDbUrl = superlogin.getDbUrl('budgetify');
      localDB = new PouchMirror('budgetify', remoteDbUrl);
      localDB.setMaxListeners(30);
  }

function onDeleted(id) {
  var index = binarySearch(records, id);
  var doc = records[index];
  if (doc && doc._id === id) {
    records.splice(index, 1);
  }
}

function onUpdatedOrInserted(newDoc) {
  var index = binarySearch(records, newDoc._id);
  var doc = records[index];
  if (doc && doc._id === newDoc._id) { // update
    records[index] = newDoc;
  } else { // insert
    records.splice(index, 0, newDoc);
  }
}

function binarySearch(arr, docId) {
  var low = 0, high = arr.length, mid;
  while (low < high) {
    mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
    arr[mid]._id < docId ? low = mid + 1 : high = mid
  }
  return low;
}

function getRecordsForMonth(month) {
  var monthrecords = [];
  if(localDB) {
   return $q.when(localDB.search({
      query:month,
      fields:['month'],
      include_docs:true
   })).then(function(result) {
       _.forEach(result.rows, function(doc) {
         monthrecords.push(decrypted(doc.doc));
      });
      return monthrecords;
   }).catch(function(err) {
     $log.debug.bind(console);
   });
 } else {
  concole.log.bind(console);
 }
}

function getRecordsForWeek(week) {
  var weekrecords = [];
  if(localDB) {
   return $q.when(localDB.search({
      query:week,
      fields:['week'],
      include_docs:true
   })).then(function(result) {
      _.forEach(result.rows, function(doc) {
         weekrecords.push(decrypted(doc.doc));
      });
      return weekrecords;
   }).catch(function(err) {
     $log.debug.bind(console);
   });
 } else {
  concole.log.bind(console);
 }
}

function getRecordsForDay(day) {
  var dayrecords = [];
   return $q.when(localDB.search({
      query:day,
      fields:['dayDate'],
      include_docs:true
   })).then(function(result) {
      _.forEach(result.rows, function(doc) {
         dayrecords.push(decrypted(doc.doc));
      });
      return dayrecords;
   }).catch(function(err) {
     $log.debug.bind(console);
   });
}


function reactToChanges() {
  localDB.changes({live: true, since: 'now', include_docs: true}).on('change', function (change) {
    if (change.deleted) {
      // change.id holds the deleted id
      onDeleted(change.id);
    } else { // updated/inserted
      // change.doc holds the new doc
      onUpdatedOrInserted(change.doc);
    }
  }).on('error', function() {
    localDB.changes.cancel();
  });
  return $q.when(records);
}

function getRecordsForYear(year) {
  var yearrecords = [];
  if(localDB) {
   return $q.when(localDB.search({
      query:year,
      fields:['year'],
      include_docs:true
   })).then(function(result) {
      _.forEach(result.rows, function(doc) {
         yearrecords.push(decrypted(doc.doc));
      });
      return yearrecords;
   }).catch(function(err) {
     $log.debug.bind(console);
   });
 } else {
  $log.debug.bind(console);
 }
}

function encrypted(record) {
  var rec = {};
 Object.keys(record).forEach(function(prop) {
    if(prop === 'value' || prop === 'img' || prop === 'name' || 
      prop === 'createdAt') {
      rec[prop] = $crypto.encrypt(record[prop], $localStorage.encryptionKey);
    } else {
      rec[prop] = record[prop];
    }
    if(prop === 'details') {
      rec[prop] = record[prop] === '' ? '' : $crypto.encrypt(record[prop], $localStorage.encryptionKey);
    }
  });
  return rec;
}

function decrypted(record) {
  var rec = angular.copy(record);
  rec.value = $crypto.decrypt(rec.value, $localStorage.encryptionKey);
  rec.img = $crypto.decrypt(rec.img, $localStorage.encryptionKey);
  rec.name = $crypto.decrypt(rec.name, $localStorage.encryptionKey);
  rec.createdAt = $crypto.decrypt(rec.createdAt, $localStorage.encryptionKey);
  rec.details = record.details === '' ? '' : $crypto.decrypt(record.details,$localStorage.encryptionKey);
 return rec;
}

  function destroySequence() {
    if(localDB) {
      localDB.destroyLocal().then(function() {
        localDB = null;
      });
    }
    return $q.when();
  }

  $rootScope.$on('sl:login', function() {
    destroySequence().then(function() {
      startSequence();
    });
  });

  $rootScope.$on('sl:logout', function(){
     destroySequence();
  });

  function addRecord(record) {
    $q.when(localDB.post(encrypted(record)));
  }

  function updateRecord(record) {
    $q.when(localDB.put(encrypted(record)));
  }

  function deleteRecord(record) {
    return localDB.remove(record._id, record._rev);
  }

function changesListener(onChange) {
  localDB.changes({live:true}).on('change', onChange);
}


    return {
      addRecord:addRecord,
      updateRecord:updateRecord,
      deleteRecord:deleteRecord,
      startSequence:startSequence,
      getRecordsForMonth:getRecordsForMonth,
      getRecordsForYear:getRecordsForYear,
      getRecordsForWeek:getRecordsForWeek,
      getRecordsForDay:getRecordsForDay,
      reactToChanges:reactToChanges,
      changesListener:changesListener
    }
});

services.factory('setDatesFromDay', function($rootScope) {
  return function(date) {
    $rootScope.selection.month = moment(date).format('MMMM'),
    $rootScope.selection.month_locale = moment(date).lang($rootScope.locale).format('MMMM'),
    $rootScope.selection.monthNumber = moment(date).format('MM'),
    $rootScope.selection.year = moment(date).format('YYYY'),
    $rootScope.selection.day = moment(date).format('DD'),
    $rootScope.selection.firstDay = moment(date).startOf('month').format('D'),
    $rootScope.selection.firstDayDate = moment(date).startOf('month').lang('en').format('ddd'),
    $rootScope.selection.lastDay = moment(date).endOf('month').format('DD'),
    $rootScope.selection.week = moment(date).isoWeek(),
    $rootScope.selection.firstWeek = moment(date).startOf('month').isoWeek(),
    $rootScope.selection.lastWeek = moment(date).endOf('month').isoWeek()
  }
});

services.factory('setDatesfromWeek', function($rootScope) {
  return function(weekNumber) {
    $rootScope.selection.month = moment($rootScope.selection.year).add(weekNumber,'weeks').format('MMMM');
    $rootScope.selection.month_locale = moment($rootScope.selection.year).add(weekNumber, 'weeks')
    .lang($rootScope.locale).format('MMMM');
    $rootScope.selection.monthNumber = moment($rootScope.selection.year).add(weekNumber,'weeks').format('MM');
    $rootScope.selection.firstDay = moment($rootScope.selection.year).add(weekNumber, 'weeks').startOf('month').format('D');
    $rootScope.selection.firstDayDate = moment($rootScope.selection.year).add(weekNumber, 'weeks').startOf('month').lang('en').format('ddd');
    $rootScope.selection.lastDay = moment($rootScope.selection.year).add(weekNumber, 'weeks').endOf('month').format('DD');
    $rootScope.selection.firstWeek = moment($rootScope.selection.year).add(weekNumber, 'weeks').startOf('month').isoWeek();
    $rootScope.selection.lastWeek = moment($rootScope.selection.year).add(weekNumber, 'weeks').endOf('month').isoWeek();
  }

});










   


