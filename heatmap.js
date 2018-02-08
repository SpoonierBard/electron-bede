//initializes dropdowns
$(document).ready(function() {
    $( "#heatmap1Menu" ).change(function () {
        let heatmapTopic1 = $("#heatmap1Menu option:selected").val();
        replaceHeatmap(1, heatmapTopic1);
    });
    $( "#heatmap2Menu" ).change(function () {
        let heatmapTopic2 = $("#heatmap2Menu option:selected").val();
        replaceHeatmap(2, heatmapTopic2);
    });
    $( "#heatmap3Menu" ).change(function () {
        let heatmapTopic3 = $("#heatmap3Menu option:selected").val();
        replaceHeatmap(3, heatmapTopic3);
    });
});
/*
$( function() {
    $( "#heatmap1Menu" ).selectmenu({
        change: function( event, ui ) {
            heatmapTopic1 = $('#heatmap1Menu').find(":selected").text();
            //console.log(heatmapTopic1);
            replaceHeatmap(1, heatmapTopic1);
        }
    });
    $( "#heatmap2Menu" ).selectmenu({
        change: function( event, ui ) {
            heatmapTopic2 = $('#heatmap2Menu').find(":selected").text();
            //console.log(heatmapTopic1);
            replaceHeatmap(2, heatmapTopic2);
        }
    });
    $( "#heatmap3Menu" ).selectmenu({
        change: function( event, ui ) {
            heatmapTopic3 = $('#heatmap3Menu').find(":selected").text();
            //console.log(heatmapTopic1);
            replaceHeatmap(3, heatmapTopic3);
        }
    });
} );
*/
//$( "#heatmap1Menu" ).on( "selectmenuchange", function( event, ui ) {} );

var prevalenceArray = [];
var heatmapWidthPx = 500;
var heatmapResPx = 1;
var heatmapSmoothing = 10;

var heatmapTopic1 = 0;
var heatmapTopic2 = 1;
var heatmapTopic3 = 2;

function createPrevalenceArray(topic) {
     var innerArray = [];
     for (i=0; i<model.wordsByLocationWithStopwords.length; i++) {
             for (j=0; j<model.wordsByLocationWithStopwords[i].length; j++) {
                     if (model.topicsByLocationWithStopwords[i][j] == topic) {
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
    prevalenceArray = [];
    return binnedArray;
}

function smoothArray(originalArray, smoothingRadius) {
	var smoothedArray = 
		Array.apply(null, Array(originalArray.length)).map(Number.prototype.valueOf,0);
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

function initializeHeatmaps() {
//    d3.select("#heatmap1Menu").selectAll("option")
//    .data(model.topicList).enter()
//    .append("option")
//        .text(function (d) {return d})
    let topicDropdownHTML = "<option disabled selected>Select Topic</option>";
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("heatmap1Menu").innerHTML = topicDropdownHTML;
    document.getElementById("heatmap2Menu").innerHTML = topicDropdownHTML;
    document.getElementById("heatmap3Menu").innerHTML = topicDropdownHTML;

    for (iter=1; iter<4; iter++){
        topic = eval("heatmapTopic" + iter);

        changeTop5Words(iter, (iter - 1));

        var svg = d3.select("#heatmapSVG" + iter);
        svg.style("width", function(){
            return heatmapWidthPx*1.5 + "px"
        })
        svg.style("height", 50)
        
        var binnedArray = createPrevalenceArray(topic);
        binnedArray = smoothArray(binnedArray, heatmapSmoothing);
        
        drawRectangles(svg, binnedArray);
        console.log(iter);
    }
}

function changeTop5Words(heatmapNum, topic) {
    //var topic = eval("heatmapTopic" + heatmapNum);
    var topicWords = Object.keys(model.topicWordInstancesDict[topic]);
    var sortedWords = topicWords.sort(function(a,b){
        return model.topicWordInstancesDict[topic][b] - model.topicWordInstancesDict[topic][a];
    });
    var top5Words = "Topic " + (parseInt(topic) + 1) + ": ";
    for (j=0; j<5; j++) {
        top5Words = top5Words + sortedWords[j] + ", ";
    }
    d3.select("#topicLabel" + heatmapNum).text(top5Words)
}

function drawRectangles(svg, dataset) {
    var colorScale = d3.scaleLinear()
        .domain([d3.min(dataset),
                 d3.max(dataset)])
        .range(["lightblue", "darkblue"])
    
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

function replaceHeatmap(heatmapNum, topic) {
    var svg = d3.select("#heatmapSVG" + heatmapNum);   
    svg.html("");
    var binnedArray = createPrevalenceArray(topic);
    binnedArray = smoothArray(binnedArray, heatmapSmoothing);
    drawRectangles(svg, binnedArray);
    changeTop5Words(heatmapNum, topic);
}


