console.log("test")

var prevalenceArray = [];
function createPrevalenceArray(topic) {
     var innerArray = [];
     for (i=0; i<wordsByLocation.length; i++) {
             for (j=0; j<wordsByLocation[i].length; j++) {
                     if (topicsByLocation[i][j] == topic) {
                             innerArray.push(1);
                     } else {
                             innerArray.push(0);
                     }
             }
             prevalenceArray.push(innerArray);
             innerArray = [];
     }
}

createPrevalenceArray(0);
console.log(prevalenceArray);

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