/**
 *
 * timetable.js
 *
 */

class Timetable {

  /* コンストラクタ */
  constructor(svgId, records, nDates=7, 
    margin={top: 20, right: 20, bottom: 20, left: 32}) {

    // マージンのチェック
    let validKeys = ["top", "right", "bottom", "left"];
    let keys = Object.keys(margin);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (validKeys.indexOf(key) === -1) {
        let emsg = "Invalid margin key passed";
        throw new Error(emsg);
      }
    }
    this.margin = margin;

    // SVG 要素を取得する
    let svg = d3.select(`#${svgId}`);
    this.svg = svg;
    this.width = parseInt(svg.style("width").replace("px", ""));
    this.height = parseInt(svg.style("height").replace("px", ""));

    // テーブルで表示する日数
    this.nDates = nDates;

    // データを日付変更線で分割する
    this.records = Timetable.splitByDateLine(records);

    // x 方向のスケールを設定する
    this.x = this.setXScale();

    // y 方向のスケールを設定する
    this.y = this.setYScale();

    // 日付文字列のリストを取得する
    this.dateStrs = this.getDateStrs();

    // x 軸と目盛りを作成する
    this.xAxis = this.setXAxis();

    // y 軸と目盛りを作成する
    this.yAxis = this.setYAxis();

    // バーを描画する
    this.bars = this.drawBars();

    // x 軸の目盛りの日付文字列の位置を調整する
    this.setXAxisPosition();

    // x 方向の罫線のスタイルを設定する
    this.setXGridStyle();

    // y 方向の罫線のスタイルを設定する
    this.setYGridStyle();

    // x 方向のパスのスタイルを設定する
    this.setXAxisPathStyle();

    // y 方向のパスのスタイルを設定する
    this.setYAxisPathStyle();

  }

  /* x 方向のスケールを設定する */
  setXScale() {
    return d3.scaleLinear()
      .domain([0, this.nDates])
      .range([this.margin.left, this.width - this.margin.right]);
  }

  /* y 方向のスケールを設定する */
  setYScale() {
    return d3.scaleLinear()
      .domain([0, 24])
      .range([this.margin.top, this.height - this.margin.bottom]);
  }

  /* 日付文字列のリストを取得する */
  getDateStrs() {
    let tod = new Date();
    return [0, 1, 2, 3, 4, 5, 6].map((n) => {
      let tmp = new Date();
      tmp.setDate(tod.getDate() - n);    // n 日前
      let ymd = tmp.toLocaleString().split(" ")[0];
      let md = ymd.substring(5);    // 月/日のみ
      return md;
    }).reverse();
  }

  /* x 軸と目盛りを作成する */
  setXAxis() {
    return this.svg.append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        "translate(" +
          [
            0,
            this.height - this.margin.bottom
          ].join(",") + ")"
      )
      .call(
        d3.axisBottom(this.x)
          .ticks(this.nDates)
          .tickSize(-this.height + this.margin.top + this.margin.bottom)
          .tickFormat((d, i) => {
            return this.dateStrs[i];
          })
      );
  }

  /* y 軸と目盛りを作成する */
  setYAxis() {
    return this.svg.append("g")
      .attr("class", "y-axis")
      .attr(
        "transform",
        "translate(" +
          [
            this.margin.left,
            0
          ].join(",") + ")"
      )
      .call(
        d3.axisLeft(this.y)
          .ticks(24)
          .tickSize(-this.width + this.margin.left + this.margin.right)
          .tickFormat(d => [d, "00"].join(":"))
      );
  }

  /* バーの色を設定する */
  setBarColor(d, i) {
    return "steelblue";
  }

  /* バーを描画する */
  drawBars() {

    // 内側部分の幅
    let innerWidth = 
      this.width - this.margin.left - this.margin.right;

    // 内側部分の高さ
    let innerHeight = 
      this.height - this.margin.bottom - this.margin.top;

    // バーの横幅
    let barWidth = innerWidth / this.nDates;
    this.barWidth = barWidth;

    return this.svg.selectAll("rect")
      .data(this.records)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        let start = d[0];
        let startYmd = start.toLocaleString().split(" ")[0];
        let startMd = startYmd.substring(5);
        return this.x(this.dateStrs.indexOf(startMd));
      })
      .attr("y", (d, i) => {
        let start = d[0];
        return this.y(Timetable.toHour(start));
      })
      .attr("width", barWidth)
      .attr("height", (d, i) => {
        let milliSecInDay = 86400000;    // ミリ秒
        let [start, finish] = d;
        console.dir(d);
        return innerHeight * (finish - start) / milliSecInDay;
      })
      .attr("fill", this.setBarColor)
      .style("opacity", 0.6);

  }

  /* x 軸の目盛りの日付文字列の位置を調整する */
  setXAxisPosition() {
    this.xAxis.selectAll("g.tick")
      .selectAll("text")
      .attr(
        "transform",
        "translate(" +
          [
            this.barWidth / 2,
            0
          ].join(",") + ")"
      );
  }

  /* x 方向の目盛りの色を設定する */
  setXAxisColor(d, i) {
    return "lightgray";
  }

  /* x 方向の目盛りのスタイルを設定する */
  setXGridStyle() {
    this.svg.selectAll("g.x-axis line")    // ※クラスが違うだけ
      .attr("stroke", this.setXAxisColor)
      .attr("stroke-opacity", 0.7)
      .attr("shape-rendering", "crispEdges");
  }

  /* x 方向の目盛りの色を設定する */
  setYAxisColor(d, i) {
    return "lightgray";
  }

  /* x 方向の目盛りのスタイルを設定する */
  setYGridStyle() {
    this.svg.selectAll("g.y-axis line")
      .attr("stroke", this.setYAxisColor)
      .attr("stroke-opacity", 0.7)
      .attr("shape-rendering", "crispEdges");
  }

  /* x 方向のパスのスタイルを設定する */
  setXAxisPathStyle() {
    this.svg.selectAll("g.x-axis path")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "1px");
  }

  /* y 方向のパスのスタイルを設定する */
  setYAxisPathStyle() {
    this.svg.selectAll("g.y-axis path")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "1px");
  }

  /* その日の始めから何秒経過したかを返す */
  static toSec(d) {
    let elapsed = d.getHours() * 60 * 60 +
     d.getMinutes() * 60 +
     d.getSeconds();
    return elapsed;
  }

  /* その日の始めから何時間経過したかを返す */
  static toHour(d) {
    let sec = Timetable.toSec(d);
    let secInDay = 86400;
    return sec / secInDay * 24;
  }

  /* 時/分/秒 を 23:59:59 に設定する */
  static set235959(d) {
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);
    return d;
  }

  /* 時/分/秒 を 00:00:00 に設定する */
  static set000000(d) {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
  }

  /* レコード 1 件を日付変更線で分割する */
  static splitIfTomorrow(record) {

    // 開始時刻 & 終了時刻
    let [start, finish] = record;

    // 日付をまたいでいない場合は終了
    let isSameYear = start.getFullYear() ===  finish.getFullYear();
    let isSameMonth = start.getMonth() === finish.getMonth();
    let isSameDate = start.getDate() === finish.getDate();
    if (isSameYear && isSameMonth && isSameDate) {
      return record;
    } else {
      // 日付をまたいでいる場合

      // 開始日の 23:59:59
      let todayEnd = new Date(start.getTime());
      todayEnd = Timetable.set235959(todayEnd);

      // 開始時刻 ~ 開始日の 23:59:59
      let firstHalf = [start, todayEnd];

      // 終了日の 00:00:00
      let tomorrowStart = new Date(finish.getTime());
      tomorrowStart = Timetable.set000000(tomorrowStart);

      // 終了日の 00:00:00 ~ 終了時刻
      let secondHalf = [tomorrowStart, finish];

      return [firstHalf, secondHalf];
    }

  }

  /* 日付変更線をまたぐ全てのデータを分割する */
  static splitByDateLine(records) {
    let split = [];

    for (let i = 0; i < records.length; i++) {

      // 日付変更線で分割する
      let record = records[i];
      record = Timetable.splitIfTomorrow(record);

      // 分割されなかった場合
      if (record[0] instanceof Date) {
        split.push(record);
      } else {
        // 分割された場合

        for (let j = 0; j < 2; j++) {
          split.push(record[j]);
        }
      }

    }    // end of for (let i = 0; ...)

    return split;
  }

}

/* main */
/*
let data = [
  [
    new Date("2018-06-19 23:55:55"),    // 睡眠開始時刻
    new Date("2018-06-20 05:55:55"),    // 起床時刻
  ],
  [
    new Date("2018-06-22 00:10:00"),
    new Date("2018-06-22 06:00:15"),
  ],
];
let svgId = "graphArea";
let tt = new Timetable(svgId, data, 7);
console.dir(tt);
*/