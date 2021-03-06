function select(section){
  var sections = ["pill-management","calendar","visualization","impact","settings"];

  for(var i=0;i<sections.length;i++){
    if (sections[i]!=section){
      $("#"+sections[i]).hide();
      $("#"+sections[i]+"-link").removeClass("active");
    }
    else{
      $("#"+sections[i]).show();
      $("#"+sections[i]+"-link").addClass("active");
    }
  }
}

/* create a prescription object */
function createPrescription(drugName,dosage,freq,interval,length){
  var prescription = {
    DrugName : drugName,
    Dosage : dosage,
    Freq : freq,
    Interval : interval,
    Length : length,
    TimePoints : createTimeList(freq,interval,length),
    Compliance: createCompliance(interval*length),
    soundmode : -1,
    sound : new Audio("https://chimes.cornell.edu/sounds/mpeg64/almamater64.MP3")
  }

  var preJSON = JSON.stringify(prescription)

  console.log(preJSON)
  alarm(prescription)
}

/* returns an array of Date in Number format */
function createTimeList(freq,interval,length){
  var timePoints = [Number(new Date())+3000]
  const day = 86400000
  const hour = 3600000
  var d = new Date()
  console.log(length)
  if (freq==0) {
    if (d.getHours>=23) {
      d.setDate(d.getDate(Number(d)+day))
      d.setHours(7)
    } else if (d.getHours>=15) {
      d.setHours(23)
    } else {
      d.setHours(7)
    }
    for (i=0;i<length*interval;i++) {
      timePoints[timePoints.length] = Number(d)+i*24/interval*day
      console.log('recorded')
      }
  } else if (freq==1) {
    if (d.getHours>=8) {
      d.setDate(d.getDate(Number(d)+day))
    }
    d.setHours(8)
    for (i=0;i<length/interval;i++) {
      timePoints[timePoints.length] = Number(d)+i*interval*day
      console.log('recorded')
    }
  }
  console.log(timePoints)
  return timePoints
}

function createCompliance(length) {
  var timePoints = []
  for (i=0;i<length;i++){
    timePoints[timePoints.length] = 0
  }
  return timePoints
}

// number timeArray --> string (date+time) timeArray
function formatTimeArray(timeArray) {
  newArray = []
  for (i=0;i<timeArray.length;i++) {
    d = new Date(timeArray[i])
    newArray[i] = d.getDate
  }
}

/* Input:  array of timepoints of alarms (ordered chronologically)
 * Action: after the first alarm goes off, remove the first timepoint*/
function alarm(prescription){
  timepoints = prescription.TimePoints

  var targetTime = new Date(timepoints[0])

  var myInterval = setInterval(function(){
    console.log("TRY: "+new Date(timepoints[0]))
    if (String(targetTime)==String(new Date())) {
      console.log('RING!')
      popAlert(prescription,targetTime,myInterval)
      prescription.soundmode = 0
   }
    if (prescription.soundmode==0) {
      prescription.sound.play()
      soundmode = 1
    } else if (prescription.soundmode==-1) {
      prescription.sound.pause()
    }
  },1000)

}

function updateCompliance(prescription) {
  prescription.Compliance[0] = 'haha'
}

function popAlert(prescription,targetTime,myInterval) {
  timepoints = prescription.TimePoints
  swal("It's time to take "+prescription.DrugName, {
  buttons: {
    no: "No thank you",
    snooze: {
      className: "snooze",
      text: "Remind later",
    },
    taken: {
      className: "taken",
      text: "Pill taken",
    }
  },
}
)
.then((value) => {
  switch (value) {
    case "no":
      swal("Missing a dose will prolong the course of your treatment"
      + "and increase antibacterial resistance. Are you sure to cancel?",
      {buttons: {
        snooze2: {
          text:'Remind later',
        },
        no: {
          text:'Yes',
        }
        }
      }).then((value) => {
        if (value=='snooze2') {
          timepoints[0] += 9000
          targetTime = new Date(timepoints[0])
        } else if (value=='no') {
          timepoints.shift()
          targetTime = new Date(timepoints[0])
        }
      });
      break;

    case "snooze":
      swal("Okay!", "A reminder is set in 15 minutes", "success");
      timepoints[0] += 9000
      targetTime = new Date(timepoints[0])
      break;

    case "taken":
      swal("Good Job!", "You are on your way to feeling better", "success");
      clearInterval(myInterval)
      timepoints.shift()
      targetTime = new Date(timepoints[0])
      prescription.sound.pause()
      updatechart(1)
      break;
  }
  console.log('hahahah: '+value)
});
}

function addToCalendar() {
        document.getElementById("drugs1").innerHTML="Drug Name: Amoxicillin";
        document.getElementById("drugs2").innerHTML="Dosage: 775 mg";
        document.getElementById("drugs3").innerHTML="Times per Day: 3";
        document.getElementById("drugs4").innerHTML="Length: 10 days";
      }

$( document ).ready(function() {
    select("visualization");
});























/*
function updatechart(value){
  document.getElementById("demo").innerHTML = value;
  AmCharts.makeChart("chartdiv",{
     "type": "serial",
     "categoryField": "category",
     "angle": 30,
     "depth3D": 30,
     "startDuration": 1,
     "categoryAxis": {
     "gridPosition": "start",
     "fontSize": 5,
     "labelOffset": 1,
     "titleBold": false
     },
     "trendLines": [],
     "graphs": [
                {
                "balloonText": "[[title]] on [[category]]:[[value]]",
                "bulletBorderThickness": 0,
                "fillAlphas": 1,
                "fillColors": "#00D33F",
                "id": "AmGraph-1",
                "lineColor": "#00D33F",
                "title": "Number Taken On Time",
                "type": "column",
                "valueField": "column-1"
                },
                {
                "balloonText": "[[title]] on [[category]]:[[value]]",
                "fillAlphas": 1,
                "fillColors": "#F40E0E",
                "id": "AmGraph-2",
                "lineColor": "#FF0000",
                "title": "Number Missed",
                "type": "column",
                "valueField": "column-2"
                }
                ],
     "guides": [],
     "valueAxes": [
                   {
                   "id": "ValueAxis-1",
                   "stackType": "regular",
                   "labelFrequency": 2,
                   "title": ""
                   },
                   {
                   "id": "ValueAxis-2"
                   }
                   ],
     "allLabels": [],
     "balloon": {},
     "titles": [
                {
                "id": "title",
                "size": 15,
                "text": "Past 7 Days"
                }
                ],
     "dataProvider": [
                      {
                      "category": "01-10",
                      "column-1": "1",
                      "column-2": "2"
                      },
                      {
                      "category": "01-11",
                      "column-1": "2",
                      "column-2": "1"
                      },
                      {
                      "category": "01-12",
                      "column-1": "3",
                      "column-2": "0"
                      },
                      {
                      "category": "01-13",
                      "column-1": "2",
                      "column-2": "1"
                      },
                      {
                      "category": "01-14",
                      "column-1": "3",
                      "column-2": "0"
                      },
                      {
                      "category": "01-15",
                      "column-1": "1",
                      "column-2": "2"
                      },
                      {
                      "category": "01-16",
                      "column-1": value,
                      "column-2": "0"
                      }
                      ]
     }
     );

}
AmCharts.makeChart("chartdiv",{
   "type": "serial",
   "categoryField": "category",
   "angle": 30,
   "depth3D": 30,
   "startDuration": 1,
   "categoryAxis": {
   "gridPosition": "start",
   "fontSize": 5,
   "labelOffset": 1,
   "titleBold": false
   },
   "trendLines": [],
   "graphs": [
              {
              "balloonText": "[[title]] on [[category]]:[[value]]",
              "bulletBorderThickness": 0,
              "fillAlphas": 1,
              "fillColors": "#00D33F",
              "id": "AmGraph-1",
              "lineColor": "#00D33F",
              "title": "Number Taken On Time",
              "type": "column",
              "valueField": "column-1"
              },
              {
              "balloonText": "[[title]] on [[category]]:[[value]]",
              "fillAlphas": 1,
              "fillColors": "#F40E0E",
              "id": "AmGraph-2",
              "lineColor": "#FF0000",
              "title": "Number Missed",
              "type": "column",
              "valueField": "column-2"
              }
              ],
   "guides": [],
   "valueAxes": [
                 {
                 "id": "ValueAxis-1",
                 "stackType": "regular",
                 "labelFrequency": 2,
                 "title": ""
                 },
                 {
                 "id": "ValueAxis-2"
                 }
                 ],
   "allLabels": [],
   "balloon": {},
   "titles": [
              {
              "id": "title",
              "size": 15,
              "text": "Past 7 Days"
              }
              ],
   "dataProvider": [
                    {
                    "category": "01-10",
                    "column-1": "1",
                    "column-2": "2"
                    },
                    {
                    "category": "01-11",
                    "column-1": "2",
                    "column-2": "1"
                    },
                    {
                    "category": "01-12",
                    "column-1": "3",
                    "column-2": "0"
                    },
                    {
                    "category": "01-13",
                    "column-1": "2",
                    "column-2": "1"
                    },
                    {
                    "category": "01-14",
                    "column-1": "3",
                    "column-2": "0"
                    },
                    {
                    "category": "01-15",
                    "column-1": "1",
                    "column-2": "2"
                    },
                    {
                    "category": "01-16",
                    "column-1": "0",
                    "column-2": "0"
                    }
                    ]
   }
   );
   */
