(function addTimeAMPM() {
  var lastupdate = document.getElementById('ipstlastrefresh');
  if (typeof lastupdate == 'object' && lastupdate !== null) {
    if (/as of.*(AM|PM)/.test(lastupdate.innerHTML)) {
      var lastupdatetime = lastupdate.innerHTML.replace(/^.*as of( |&nbsp;)*/,'');

      if (/^[0-9]+:[0-9][0-9] (AM|PM)/.test(lastupdatetime)) {  
        var tables = document.getElementsByClassName('ipf-st-ip-trains-subtable');

        for (var i = 0; i < tables.length; i++) {
          var trainNumbers = tables[i].querySelectorAll('.ipf-st-ip-trains-subtable-tr .ipf-st-ip-trains-subtable-td-id');
          var departTimes = tables[i].querySelectorAll('.ipf-st-ip-trains-subtable-tr .ipf-st-ip-trains-subtable-td-arrivaltime');
          var trainTypes = tables[i].querySelectorAll('.ipf-st-ip-trains-subtable-tr .ipf-st-ip-trains-subtable-td-type');
          for (var j = 0; j < departTimes.length; j++) {
            if (!(/realtime\-ampm/.test(departTimes[j].innerHTML))) {
              var addMinutes = parseInt(departTimes[j].innerHTML.replace(/min. */,''));
            
              if (addMinutes >= 0) {
                departTimes[j].innerHTML += " <span class=\"realtime-ampm\">" + getDepartTime(lastupdatetime, addMinutes) + "</span>";
              }
              /* Add styling to type of train */
              if (/^Limited$|^Baby Bullet$|^Local$|^Special$/.test(trainTypes[j].innerHTML)) {
                var trainTypeText = trainTypes[j].innerHTML;
                if (/^Limited$/.test(trainTypes[j].innerHTML)) {
                  trainTypes[j].innerHTML = "<span style=\"background-color: #f7e89d;\">" + trainTypeText + "</span>";
                } else if (/^Special$/.test(trainTypes[j].innerHTML)) {
                  if (isGiantsSpecial(trainNumbers[j].innerHTML)) {
                    trainTypes[j].innerHTML = "<span style=\"background-color: #ff8000;\">Giants</span>";  
                  } else {
                    trainTypes[j].innerHTML = "<span style=\"background-color: #2dccd3;\">Special</span>";
                  }
                } else if (/^Baby Bullet$/.test(trainTypes[j].innerHTML)) {
                  trainTypes[j].innerHTML = "<span style=\"background-color: #f0b2a1;\">" + trainTypeText + "</span>";
                } else {
                  trainTypes[j].innerHTML = "<span style=\"background-color: #fff;\">" + trainTypeText + "</span>";
                }
              }
            }
          }
        }
      }
    }
  }

  setTimeout(addTimeAMPM, 1000);
})();

function getDepartTime(time, minutes) {
  var timeInMinutes = convert2minutes(time);
  
  var departTimeMin = timeInMinutes + minutes;
  if (departTimeMin > 24 * 60) {
    departTimeMin = departTimeMin - (24 * 60);
  }
  
  return minutes2ampm(departTimeMin);
}

function minutes2ampm(totalMinutes) {
  var hours = Math.floor(totalMinutes / 60);
  var minutes = totalMinutes % 60;
  var ampm = 'AM';
  if (hours > 12) {
    ampm = 'PM';
    hours = hours - 12;
  } else if (hours === 12) {
    ampm = 'PM';
  } else if (hours === 0) {
    hours = 12;
  }
  
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(minutes<10) sMinutes = "0" + sMinutes;
  return sHours + ":" + sMinutes + " " + ampm;
}

function convert2minutes(time) {
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

function isGiantsSpecial(trainNum) {
  var giantsTrains = {
    '05142018': ['S09','S11'],
    '05162018': ['S01'],
    '05202018': ['S09','S11'],
    '06022018': ['S01','S03'],
    '06032018': ['S01','S03'],
    '06062018': ['S01'],
    '06202018': ['S01'],
    '06232018': ['S01','S03'],
    '06242018': ['S05','S07'],
    '06282018': ['S01'],
    '07072018': ['S01','S03'],
    '07082018': ['S01','S03'],
    '07112018': ['S01'],
    '07142018': ['S01','S03'],
    '07152018': ['S01','S03'],
    '07282018': ['S01','S03'],
    '07292018': ['S01','S03'],
    '08072018': ['S01'],
    '08112018': ['S01','S03'],
    '08122018': ['S01','S03'],
    '08252018': ['S01','S03'],
    '08262018': ['S01','S03'],
    '09012018': ['S01','S03'],
    '09022018': ['S01','S03'],
    '09122018': ['S01'],
    '09152018': ['S01','S03'],
    '09162018': ['S01','S03'],
    '09292018': ['S01','S03'],
    '09302018': ['S01','S03'],
  }
  var today = new Date();
  var monthDigit = today.getMonth() + 1;
  var mm = monthDigit < 10 ? "0" + monthDigit.toString() : monthDigit.toString();
  var dateDigit = today.getDate();
  var dd = dateDigit < 10 ? "0" + dateDigit.to_string() : dateDigit.toString();
  var todaysDate = mm + dd + today.getFullYear().toString();
  if (todaysDate in giantsTrains) {
    for( var i = 0; i < giantsTrains[todaysDate].length; i++) {
      var trainRegEx = new RegExp("^" + trainNum + "$");
      if (trainRegEx.test(giantsTrains[todaysDate][i])) {
        return true;
      }
    }
  }
  return false;
}