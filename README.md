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
