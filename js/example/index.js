var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var colorKeysAlreadyUsed = new Map();
// var relevantsProperties = ["Browser","Referrer","uid"];

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("~app/example/data/candidates_task.json",function (data){

  document.getElementById("property").innerHTML = data.anomalousProperty.key + " : " + data.anomalousProperty.value;

  x.domain(d3.extent(data.significantVariables, function(d) { return d.relativeChange; })).nice();
  y.domain(data.significantVariables.map(function(d) {
      var entry = d.key + ":" + d.value;
      return entry;
  }));

    svg.selectAll(".bar")
        .data(data.significantVariables)
        .enter().append("rect")
        .attr("fill",function(d){
          if(colorKeysAlreadyUsed.has(d.key)){
              return colorKeysAlreadyUsed.get(d.key);
          }else{
              var color = getRandomColor();
                colorKeysAlreadyUsed.set(d.key,color);
              return color;
          }
        })
        .attr("x", function(d) { return x(Math.min(0, d.relativeChange)); })
        .attr("y", function(d) {
            var entry = d.key + ":" + d.value;
            return y(entry);
        })
        .attr("width", function(d) { return Math.abs(x(d.relativeChange) - x(0)); })
        .attr("height", y.rangeBand());

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(yAxis);


    var keys = Array.from(colorKeysAlreadyUsed.keys());
    var values = Array.from(colorKeysAlreadyUsed.values());
    var legendColors = d3.scale.ordinal()
        .range(values);

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")";  });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill",legendColors);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
});

