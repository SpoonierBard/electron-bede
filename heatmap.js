var dataset = [[1, 2, 3, 4, 5, 4, 3, 3, 3, 4, 5, 4, 3, 2, 1], [0, 1, 2, 3, 5, 7, 7, 6, 5, 4]]

var colorScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(docArray) {
                return d3.min(docArray);}),
             d3.max(dataset, function(docArray) {
                return d3.max(docArray);})])
    .range(["red", "blue"])

d3.select("#heatmap").append("svg").selectAll("rect")
    .data(dataset[1])
    .enter()
    .append("rect")
    .attr("width", 20)
    .attr("height", 30)
    .attr("y", function(d) {return 50})
    .attr("x", function(d,i) {return i * 20})
    .style("fill", function(d) {return colorScale(d);})