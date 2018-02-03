var prevalenceArray = [];
var heatmapWidthPx = 500;
var heatmapResPx = 1;
var heatmapSmoothing = 10;

//calls other functions to create the heatmap and surrounding info
function buildFullHeatmap(topic) {
    var binnedArray = createPrevalenceArray(topic);
	binnedArray = smoothArray(binnedArray, heatmapSmoothing);
    //create a label to show the top 5 topics
    var topicWords = Object.keys(model.topicList[topic]);
    var sortedWords = topicWords.sort(function(a,b){
        return model.topicList[topic][b] - model.topicList[topic][a];
    });
    var top5Words = "Topic " + topic + ": ";
    for (i=0; i<5; i++) {
        top5Words = top5Words + sortedWords[i] + ", ";
    }
    
    d3.select("#heatmap").append("h4")
        .text(top5Words)
    drawHeatmap(binnedArray);
}

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
    
    var binnedArray = [0];
    var totalLength = 0;
    for (i=0; i<prevalenceArray.length; i++) {
        totalLength += prevalenceArray[i].length;
    }
    var binSize = Math.floor(totalLength/(heatmapWidthPx/heatmapResPx));
    
    var countDown = binSize;
    var curIndex = 0;
    for (i=0; i<prevalenceArray.length; i++) {
        for (j=0; j<prevalenceArray[i].length; j++) {
            countDown--;
            binnedArray[curIndex] += prevalenceArray[i][j]
            
            if (countDown<=0) {
                countDown = binSize;
                curIndex++;
                binnedArray.push(0);
            }
        }
    }
    return binnedArray;
}

function smoothArray(originalArray, smoothingRadius) {
	var smoothedArray = 
		Array.apply(null, Array(originalArray.length)).map(Number.prototype.valueOf,0);
	console.log(smoothedArray);
	for (i=0; i<originalArray.length; i++) {
		if (originalArray[i] != 0) {
			for (j=(i-smoothingRadius+1); j<i+smoothingRadius; j++) {
				if ((j >= 0)&&(j < originalArray.length)) {
					smoothedArray[j] += 
						originalArray[i]*(smoothingRadius-(i-j));
				}
			}
		}
	}
	return smoothedArray;
}

function drawHeatmap(dataset) {
    var colorScale = d3.scaleLinear()
        .domain([d3.min(dataset),
                 d3.max(dataset)])
        .range(["lightblue", "darkblue"])
    
    var svg = d3.select("#heatmap").append("svg");
    svg.style("width", function(){
        return heatmapWidthPx*1.5 + "px"
    })
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", function() {return heatmapResPx})
        .attr("height", 50)
        .attr("y", function(d) {return 0})
        .attr("x", function(d,i) {return i * heatmapResPx})
        .style("fill", function(d) {return colorScale(d);})
}
