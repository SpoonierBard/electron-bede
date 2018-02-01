//var dataset = [[1, 2, 3, 4, 5, 4, 3, 3, 3, 4, 5, 4, 3, 2, 1], [0, 1, 2, 3, 5, 7, 7, 6, 5, 4]]

var prevalenceArray = [];
function createPrevalenceArray(topic) {
     var innerArray = [];
     for (i=0; i<model.wordsByLocation.length; i++) {
             for (j=0; j<model.wordsByLocation[i].length; j++) {
                     if (model.topicsByLocation[i][j] == topic) {
                             innerArray.push(1);
                     } else {
                             innerArray.push(0);
                     }
             }
             prevalenceArray.push(innerArray);
             innerArray = [];
     }
}

function createHeatmap(dataset) {
    var colorScale = d3.scaleLinear()
        .domain([d3.min(dataset),
                 d3.max(dataset)])
        .range(["red", "blue"])
    
    d3.select("#heatmap").append("svg").selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", 2)
        .attr("height", 30)
        .attr("y", function(d) {return 50})
        .attr("x", function(d,i) {return i * 2})
        .style("fill", function(d) {return colorScale(d);})
}
