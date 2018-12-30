var urls =
["https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json", "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json", "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"];

var w = 1000;
var h = 800;
var fader = function fader(color) {return d3.interpolateRgb(color, "#fff")(0.2);},
color = d3.scaleOrdinal(d3.schemeCategory20b.map(fader)),
format = d3.format(",d");
var cR = 0;

function gamehandler() {
  cR = 2;
  loadDataset();
  $("#title").html("Video Game Sales");
  $("#desc").html("Top 100 Most Sold Video Games Grouped by Platform");
};

function moviehandler() {
  cR = 1;
  loadDataset();
  $("#title").html("Movie Sales");
  $("#desc").html("Top 100 Highest Grossing Movies Grouped By Genre");
};

function kickhandler() {
  cR = 0;
  loadDataset();
  $("#title").html("Kickstarter Pledges");
  $("#desc").html("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");
};

function callTreeMap(reqData) {

  data = JSON.parse(reqData);

  d3.selectAll("svg").remove();

  var contsvg = d3.select("#main").append("svg").
  attr("class", "mainsvg").
  attr("width", w).
  attr("height", h);


  var tooltip = d3.select("#main").append("div").
  attr("class", "tooltip").
  attr("id", "tooltip").
  style("opacity", 0);

  var root = d3.hierarchy(data).
  eachBefore(function (d) {
    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
  }).
  sum(function (d) {return d.value;}).
  sort(function (a, b) {return b.value - a.value;});

  var treemap = d3.treemap().
  size([w, h]).
  paddingInner(1);
  treemap(root);

  var block = contsvg.selectAll("g").
  data(root.leaves()).
  enter().
  append("g").
  attr("transform", function (d) {return "translate(" + d.x0 + ", " + d.y0 + ")";});


  block.append("rect").
  attr("id", function (d) {return d.data.id;}).
  attr("width", function (d) {return d.x1 - d.x0;}).
  attr("height", function (d) {return d.y1 - d.y0;}).
  attr("data-name", function (d) {return d.data.name;}).
  attr("data-category", function (d) {return d.data.category;}).
  attr("data-value", function (d) {return d.data.value;}).
  attr("fill", function (d) {return color(d.data.category);}).
  on("mouseover", function (d) {

    tooltip.style("opacity", .9);
    tooltip.html(
    'Name: ' + d.data.name +
    '<br>Category: ' + d.data.category +
    '<br>Value: ' + d.data.value).

    attr("data-value", d.data.value).
    style("left", d3.event.pageX + 20 + "px").
    style("top", d3.event.pageY - 20 + "px");
  }).
  on("mouseout", function (d) {
    tooltip.style("opacity", 0);
  });

  block.append("text").
  selectAll("tspan").
  data(function (d) {
    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
  }).
  enter().
  append("tspan").
  attr("class", "cell-title").
  attr("x", 4).
  attr("y", function (d, i) {return 13 + i * 10;}).
  text(function (d) {return d;});

  var cat = root.leaves().map(function (e) {
    return e.data.category;
  });
  cat = cat.filter(function (category, index, self) {
    return self.indexOf(category) === index;
  });

  var legend = d3.
  select("#legend").
  append("svg").
  attr("class", "svglegend").
  attr("width", w).
  attr("height", 55 * 5).
  attr("x", 80).
  attr("y", h);

  legend.selectAll("rect").
  data(cat).
  enter().
  append("rect").
  attr("class", "legend-item").
  attr("x", function (d, i) {
    var xOffset = parseInt(i / 5);
    return xOffset * 200;
  }).
  attr("y", function (d, i) {
    return i % 5 * 51;
  }).
  attr("width", 50).
  attr("height", 50).
  attr("fill", function (d, i) {
    return color(d);
  });

  legend.selectAll("text").
  data(cat).
  enter().
  append("text").
  attr("x", function (d, i) {
    var xOffset = parseInt(i / 5);
    return xOffset * 200 + 55;
  }).
  attr("y", function (d, i) {
    return i % 5 * 51 + 28;
  }).
  text(function (d) {return d;});
}


function loadDataset() {
  req = new XMLHttpRequest();
  req.open("GET", urls[cR], true);
  req.send();

  req.onload = function () {
    callTreeMap(req.responseText);

  };
};

document.addEventListener("DOMContentLoaded", function () {

  gamehandler();

});