var svg = d3.selectAll("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
  .rangeRound([0, width]);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);

var line = d3.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.close);
  });

data_imported = '';

d3.tsv("data.tsv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;
  data_imported = data;
});

var xAxisG = g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "x_axis")
  .call(d3.axisBottom(x))
  .append("text")
  .attr("fill", "#000")
  .attr("x", width)
  .attr("dy", "-0.71em")
  .attr("text-anchor", "end")
  .text("Year")
  .select(".domain");

var yAxisG = g.append("g")
  .attr("class", "y_axis")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Price ($)");


function update(data) {

  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  
  y.domain(d3.extent(data, function(d) {
    return d.close;
  }));
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line)
    .attr("class", "curve");
  
  var xAxisG = g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x_axis")
    .call(d3.axisBottom(x).ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width)
    .attr("dy", "-0.71em")
    .attr("text-anchor", "end")
    .text("Year")
    .select(".domain");

  var yAxisG = g.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(y).ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");


}

update(data_imported.slice(0, 12));


counter = 12;
d3.interval(function() {
  d3.selectAll(".curve").remove();
  d3.selectAll(".x_axis").remove();
  d3.selectAll(".y_axis").remove();
  if (counter == 1279)
    counter = 12;
  update(data_imported.slice(0, counter++));
}, 1500);

/*
var scale = d3.scale.linear()
        .domain([1, 5])   // Data space
        .range([0, 200]); // Pixel space

      var svg = d3.select("body").append("svg")
        .attr("width",  250)
        .attr("height", 250);

      function render(data, color){

        // Bind data
        var rects = svg.selectAll("rect").data(data);
        
        // Enter
        rects.enter().append("rect")
          .attr("y", 50)
          .attr("width",  20)
          .attr("height", 20);

        // Update
        rects
          .attr("x", scale)
          .attr("fill", color);

        // Exit
        rects.exit().remove();
      }

      render([1, 2, 2.5],     "red");
      render([1, 2, 3, 4, 5], "blue"); 
      render([1, 2],          "green");*/
/*

      var outerWidth = 500;
      var outerHeight = 250;
      var margin = { left: 70, top: 5, right: 5, bottom: 60 };

      var xColumn = "timestamp";
      var yColumn = "temperature";

      var xAxisLabelText = "Time";
      var xAxisLabelOffset = 48;

      var yAxisLabelText = "Temperature °C";
      var yAxisLabelOffset = 40;

      var innerWidth  = outerWidth  - margin.left - margin.right;
      var innerHeight = outerHeight - margin.top  - margin.bottom;

      var svg = d3.select("body").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight);
      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var path = g.append("path")
        .attr("class", "chart-line");

      var xAxisG = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerHeight + ")")
      var xAxisLabel = xAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
        .attr("class", "label")
        .text(xAxisLabelText);

      var yAxisG = g.append("g")
        .attr("class", "y axis");
      var yAxisLabel = yAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
        .attr("class", "label")
        .text(yAxisLabelText);

      var xScale = d3.time.scale().range([0, innerWidth]);
      var yScale = d3.scale.linear().range([innerHeight, 0]);

      var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .ticks(5)
        .outerTickSize(0);
      var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .ticks(5)
        .tickFormat(d3.format("s"))
        .outerTickSize(0);

      var line = d3.svg.line()
        .x(function(d) { return xScale(d[xColumn]); })
        .y(function(d) { return yScale(d[yColumn]); });

      function render(data){
        xScale.domain(d3.extent(data, function (d){ return d[xColumn]; }));
        yScale.domain(d3.extent(data, function (d){ return d[yColumn]; }));

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        path.attr("d", line(data));
      }

      function type(d){
        d.timestamp = new Date(d.timestamp);
        d.temperature = +d.temperature;
        return d;
      }

      d3.csv("week_temperature_sf.csv", type, render);
*/