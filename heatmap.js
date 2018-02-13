var prevalenceArray = [];
var heatmapWidthPx = 500;
var heatmapResPx = 1;
var heatmapSmoothing = 10;

var heatmapTopic1 = 0;
var heatmapTopic2 = 1;
var heatmapTopic3 = 2;

var scaledColors = ["hsl(161, 30%, 90%)", "hsl(17, 30%, 90%)", "hsl(222, 30%, 90%)", "hsl(161, 63%, 38%)", "hsl(17, 86%, 49%)", "hsl(222, 57%, 47%)"];
//var scaledColors = ["#B3E1D2", "#FEC6B1", "#C6D0E5", "#336153", "#7E4731", "#475066"];


//initializes dropdowns
$(document).ready(function() {
    $( "#heatmap1Menu" ).change(function () {
        heatmapTopic1 = $("#heatmap1Menu option:selected").val();
        replaceHeatmap(1, heatmapTopic1);
    });
    $( "#heatmap2Menu" ).change(function () {
        heatmapTopic2 = $("#heatmap2Menu option:selected").val();
        replaceHeatmap(2, heatmapTopic2);
    });
    $( "#heatmap3Menu" ).change(function () {
        heatmapTopic3 = $("#heatmap3Menu option:selected").val();
        replaceHeatmap(3, heatmapTopic3);
    });
    $("#smoothingBox").change(
    function(){
        if ($(this).is(':checked')) {
            heatmapSmoothing = parseInt($("#smoothingSelect").val());
            replaceHeatmap(1,heatmapTopic1);
            replaceHeatmap(2,heatmapTopic2);
            replaceHeatmap(3,heatmapTopic3);
        }
        else {
            heatmapSmoothing = 1;
            replaceHeatmap(1,heatmapTopic1);
            replaceHeatmap(2,heatmapTopic2);
            replaceHeatmap(3,heatmapTopic3);
        }
    });
    $("#smoothingSelect").change(function () {
        heatmapSmoothing = parseInt($("#smoothingSelect").val());
        replaceHeatmap(1,heatmapTopic1);
        replaceHeatmap(2,heatmapTopic2);
        replaceHeatmap(3,heatmapTopic3);
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
				if ((j >= 0)&&(j <= i)) {
					smoothedArray[j] += 
						originalArray[i]*(smoothingRadius-(i-j));
				}
                if ((j > i)&&(j < originalArray.length)) {
                    smoothedArray[j] += 
						originalArray[i]*(smoothingRadius+(i-j));
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
    let topicDropdownHTML = "<option disabled>Select Topic</option>";
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("heatmap1Menu").innerHTML = topicDropdownHTML;
    $('#heatmap1Menu option')[1].selected = true;
    document.getElementById("heatmap2Menu").innerHTML = topicDropdownHTML;
    $('#heatmap2Menu option')[2].selected = true;
    document.getElementById("heatmap3Menu").innerHTML = topicDropdownHTML;
    $('#heatmap3Menu option')[3].selected = true;
    
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
        
        drawRectangles(svg, binnedArray, iter);
    }
}

function changeTop5Words(heatmapNum, topic) {
    //var topic = eval("heatmapTopic" + heatmapNum);
    var topicWords = Object.keys(model.topicWordInstancesDict[topic]);
    var sortedWords = topicWords.sort(function(a,b){
        return model.topicWordInstancesDict[topic][b] - model.topicWordInstancesDict[topic][a];
    });
    var top5Words = ": ";
    for (j=0; j<4; j++) {
        top5Words = top5Words + sortedWords[j] + ", ";
    }
    top5Words = top5Words + sortedWords[4];
    d3.select("#topicLabel" + heatmapNum).text(top5Words)
}

function drawRectangles(svg, dataset, heatmapNum) {
    var colorScale = d3.scaleLinear()
        .domain([d3.min(dataset),
                 d3.max(dataset)])
        .range([scaledColors[heatmapNum - 1], scaledColors[heatmapNum + 2]])
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", function() {return heatmapResPx})
        .attr("height", 50)
        .attr("y", 0)
        .attr("x", function(d,i) {return i * heatmapResPx})
        .style("fill", function(d) {return colorScale(d);})
        .on("mouseover", function(d){
            d3.select(this).style("fill", "black");
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill", function(d) {return colorScale(d);
            })
        })
        .on("click", function(d, i){
            console.log(i/dataset.length);
        })
}

function replaceHeatmap(heatmapNum, topic) {
    var svg = d3.select("#heatmapSVG" + heatmapNum);   
    svg.html("");
    var binnedArray = createPrevalenceArray(topic);
    binnedArray = smoothArray(binnedArray, heatmapSmoothing);
    drawRectangles(svg, binnedArray, heatmapNum);
    changeTop5Words(heatmapNum, topic);
}


