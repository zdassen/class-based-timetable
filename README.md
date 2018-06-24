# class-based-timetable
Class based D3.js timetable

# Data format
```JavaScript
// sample data
let data = [
  [
    new Date("2018-06-19 23:55:55"),    // bedtime
    new Date("2018-06-20 05:55:55"),    // wake-up time
    "sleep"                             // log title
  ],
  [
    new Date("2018-06-22 00:10:00"),
    new Date("2018-06-22 06:00:15"),
    "sleep"
  ],
  [
    new Date("2018-06-23 02:00:00"),
    new Date("2018-06-23 03:30:00"),
    "sleep"
  ]
];
```

# Draw timetable
```JavaScript
// <svg id="graphArea"></svg>
let svgId = "graphArea";

// number of dates for x axis
// because the Timetable is "table", so we must pass it
let nDates = 7;

// draw table
let tt = new Timetable(svgId, data, nDates);
```
![timetable-sample-1](https://user-images.githubusercontent.com/24271672/41818594-1322e004-77ed-11e8-8c1f-155a72dd8825.JPG)

# Override color setter of bars
```JavaScript
// data added
let data = [

  // ( data is same as above.. )

  [
    new Date("2018-06-20 12:15:16"),    // lunch time ( start )
    new Date("2018-06-20 12:46:38"),    // linch time ( finish )
    "lunch"
  ],
  [
    new Date("2018-06-21 21:05:00"),    // football lesson
    new Date("2018-06-21 22:35:00"),
    "football lesson"
  ],
  [
    new Date("2018-06-23 10:00:00"),    // meeting
    new Date("2018-06-23 16:00:00"),
    "meeting"
  ]
];

class MyTimetable extends Timetable {

  /* override bar color setter */
  setBarColor(d, i) {
    let title = d[2];    // d[0] is "start", and d[1] is "finish"
    if (title === "lunch") return "orange";
    else if (title === "football lesson") return "springgreen";
    else if (title === "meeting") return "crimson";
    else return "steelblue";
  }

}

let svgId = "graphArea";
let nDates = 7;
let mtt = new MyTimetable(svgId, data, nDates);
```
![timetable-sample-2](https://user-images.githubusercontent.com/24271672/41818672-799b2bba-77ee-11e8-97f8-89cd036c2de1.JPG)
