//TODO: add drag/drop capability for file upload

let model = {};

var colors  = ["#66c2a5", "#fc8d62", "#8da0cb"];
//Function to read data from uploaded json file. Called on button click. Saves data to localstorage as a string.
function loadFile() {
    hideUploadScreen();
    let input, reader;
    reader = new FileReader();
    input = document.getElementById("json-file");
    if (!input.files[0]) {
        console.log("Please select a file before clicking upload");
    }
    else {
        reader.onload = (function() {
            model = JSON.parse(reader.result);
            createMetadata();
            createAnnotatedText();
            createWordCloud();
        });
        reader.readAsText(input.files[0]);
    }
}

//Progress from welcome screen to data visualization tabs
function hideUploadScreen() {
    //TODO: progressbar (jquery-ui download dialog example)
    let uploadbox= document.getElementById("file-upload");
    let tabs = document.getElementById("tabs");
    uploadbox.style.display = "none";
    tabs.style.display = "block";
}

//Tab switching function
$( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
} );

$( function() {
    $("#metadata-topic-select").selectmenu({
        change: function(event, data) {
            let topicWordList = Object.keys(model.topicWordInstancesDict[data.item.value]);
            topicWordList = topicWordList.sort(function (a,b) {
                return model.topicWordInstancesDict[data.item.value][b] -
                       model.topicWordInstancesDict[data.item.value][a];
            });
            if (model.nicknames[data.item.value] === "") {
                document.getElementById("metadata-topic-preview-title").innerHTML = "Topic " + (parseInt(data.item.value) + 1);
            } else {
                document.getElementById("metadata-topic-preview-title").innerHTML = model.nicknames[data.item.value];
            }
            document.getElementById("metadata-topic-preview-text").innerHTML = topicWordList.join(", ");
        }
    })
});

function addNickname(topic, nickname){
    model.nicknames[topic] = nickname;
    document.getElementById("metadata-select-topic-" + topic).innerHTML = nickname;
}

function createMetadata(){
    document.getElementById("dataset").innerHTML = model["dataset"];
    document.getElementById("topics").innerHTML = model["topics"];
    document.getElementById("iterations").innerHTML = model["iterations"];
    document.getElementById("alpha").innerHTML = model["alpha"];
    document.getElementById("beta").innerHTML = model["beta"];

    // TODO: add nicknaming button + dialog form
    model["nicknames"] = [];
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        model.nicknames.push("");
    }

    let topicDropdownHTML = "<option disabled selected>Select Topic</option>";

    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option id=\"metadata-select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("metadata-topic-select").innerHTML = topicDropdownHTML;
}

function createAnnotatedText() {
    // for (i = 0; i < model.topics; i++) {
    //     d3.select("#tab-3-buttons")
    //         .append("input")
    //         .attr("type", "button")
    //         .attr("name", "toggle")
    //         .attr("value", "Topic " + String(i+1))
    //         .on("click", togglePressed);
    // }

    let topicDropdownHTML = "<option disabled selected>Select Topic</option>";

    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option id=\"metadata-select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("an-text-topic-select-1").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-2").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-3").innerHTML = topicDropdownHTML;


    //TODO: figure out how to reconcile d3.tip with new verion of d3
    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .html(function(d) {
    //         return "<strong>Topic:</strong> <span style='color:white'>" + d.className + "</span>";
    //     });
    //
    // d3.select('#tab-3').call(tip);

    for (docInText in model.wordsByLocationWithStopwords) {
        for (word in model.wordsByLocationWithStopwords[docInText]) {
            d3.select("#tab-3")
                .append("span")
                .text(model.wordsByLocationWithStopwords[docInText][word]+ " ")
                .attr("class", "topic-" + model.topicsByLocationWithStopwords[docInText][word])
                .on("mouseover", onHover)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide)
                .on("mouseout", offHover);
        }
    }


}

//TODO: figure out how to make selectors sticky on reaching top of window
// $(document).ready(function() {
//     $(window).scroll(function() {
//         var distanceFromTop = $(this).scrollTop();
//         if (distanceFromTop >= $('#an-text-title').height()) {
//             $('#selector-div').addClass('fixed');
//         } else {
//             $('#selector-div').removeClass('fixed');
//         }
//     });
// });

function togglePressed() {
    topicNum = this.value.slice(-1);
    topic = ".topic-" + topicNum;
    // add toggle!
    d3.selectAll(topic)
        .style("background-color", "orange");
}

function onHover() {
    topic = "." + this.className;
    selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value;
    selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value;
    selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    if ((selectedOne != this.className) && (selectedTwo != this.className) && (selectedThree != this.className)) {
        d3.selectAll(topic)
            .style("background-color", "yellow")
    }
}

function offHover() {
    topic = "." + this.className;
    selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value;
    selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value;
    selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    if ((selectedOne != this.className) && (selectedTwo != this.className) && (selectedThree != this.className)) {
        d3.selectAll(topic)
            .style("background-color", "white");
    }
}

function onSelect() {
    d3.selectAll("span")
        .style("background-color", "white");

    for (i = 0; i < 3; i++) {
        selector = "an-text-topic-select-" + (i + 1);
        topic = ".topic-" + document.getElementById(selector).value;
        d3.selectAll(topic)
            .style("background-color", function() { return colors[i]; });
    }
}

function createWordCloud() {
    let svg_location = "#word-cloud", topic = 0;

    const width = $(document).width();
    const height = $(document).height();

    let fill = d3.schemeCategory20;
    let word_entries = d3.entries(model.topicWordInstancesDict[topic]);
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(word_entries, function(d) {
            return d.value;
        })
        ])
        .range([10,100]);

    d3.layout.cloud()
        .size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .fontSize(function(d) { return xScale(+d.value); })
        .text(function(d) { return d.key; })
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return xScale(d.value) + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill[i]; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.key; });
    }

    d3.layout.cloud().stop();

}
