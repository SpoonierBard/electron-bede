console.log("test")

var dataset = [("the", 1), ("quick", 2), ("brown", 1), ("fox", 2)]
d3.select("heatmap").append("svg").selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("width", 50)
    .attr("y", function(d) {return 100 - d*50})
    .attr("x", function(d,i) {return i * 60})
    .style("fill", "rgb(0,0,255)")
    .attr("height", function(d) {
        return d * 50})