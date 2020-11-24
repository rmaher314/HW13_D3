var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  console.log("xScale called for: " + chosenXAxis);
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on label
function yScale(healthData, chosenYAxis){
  // create scales
  console.log("yScale called for: " + chosenYAxis);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(circleStates, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleStates.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]))

    return circleStates;
  }
//Adding labels to the state function.
// var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append("text");

// circleLabels
//   .attr("x", function(d) { return d.poverty; })
//   .attr("y", function(d) { return d.healthcare; })
//   .text(function(d) { return d.abbr; })
//   .attr("font-family", "sans-serif")
//   .attr("font-size", "5px")
//   .attr("fill", "white");


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label1;

  if (chosenXAxis === "poverty") {
    label1 = "In Poverty %";
  }
  else {
    label1 = "Age (Median)";
  }
  var label2;

  if (chosenYAxis === "healthcare") {
    label2 = "Healthcare";
  }
  else {
    label2 = "Smokes";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label1} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    circleStates= chartGroup.selectAll("text")    
    .enter().text(function(d) {
      console.log("Updating circles data");
      return d.abbr
      })
      .attr("font-family", "arial")
      .attr("font-size", "10px" )
      .attr("fill", "black");

  return circlesGroup;
}

// function used for updating circles group with new Y tooltip
// function updateYToolTip(chosenYAxis, circlesGroup) {

//   var label1;

//   if (chosenYAxis === "healthcare") {
//     label1 = "Healthcare";
//   }
//   else {
//     label1 = "Smokes";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label1} ${d[chosenYAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data.state);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
d3.csv("healthData.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  //yLinearScale function 
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create y scale function - comment out below because we created function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(healthData, d => d.healthcare)])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(${width}, 0)`)
    .call(leftAxis);

  // append initial circles
  //TODOs - Add lables of the d.abbr (state abrv)
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()

    //circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".75")
    .attr("text", d=>d.abbr);
    
  //TODOs - add text state labels here
  var circleStates = chartGroup.selectAll("text")
    .data(healthData)
    .enter()
  //state text
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis])+2.5)
    .attr("dy", d => yLinearScale(d[chosenYAxis])+6)
    .text(function(d) {
    return d.abbr;
    })
    .attr("font-family", "arial")
    .attr("font-size", "10px" )
    .attr("fill", "black");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  // append y axis
  var yLabelGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelGroup.append("text")
    .attr("y", 40 - margin.left)
    .attr("x", 20 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

    
  var smokesLabel = yLabelGroup.append("text")
  .attr("y", 15 - margin.left)
  .attr("x", 23 - (height / 2))
  .attr("dy", "1em")
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");



    // Original Y Labels
    // chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .classed("axis-text", true)
    // .text("Healthcare");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  //var circleStates = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup, circleStates)

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log("on click value: " + value);
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circleStates = renderText(circleStates, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


        // updates tooltips with new info 
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        //circleStates = updateToolTip(chosenXAxis, chosenYAxis, circleStates)

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


    yLabelGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log("on click value: " + value);
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circleStates = renderText(circleStates, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        //circleStates = updateToolTip((chosenXAxis, chosenYAxis, circleStates))

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          console.log("setting health active")
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          console.log("setting smokes active")
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


    console.log("end of function");

}).catch(function(error) {
  console.log(error);
});
