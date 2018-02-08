//TODO: add drag/drop capability for file upload
//This variable is global because it will contain all our data
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
        //Onload called when file is finished uploading
        //Call tab setup code here so that model is already filled with data from file
        reader.onload = (function() {
            model = JSON.parse(reader.result);
            createMetadata();
            createAnnotatedText();
            createWordCloud(-1);
            loadTabs();
        });
        reader.readAsText(input.files[0]);
    }
}

//Progress from welcome screen to progressbar
function hideUploadScreen() {
    let uploadbox = document.getElementById("file-upload");
    uploadbox.style.display = "none";
    document.getElementById("progressbar").style.display = "block";
}

//Progress from progressbar to fully loaded tabs
function loadTabs() {
    let tabs = document.getElementById("tabs");
    document.getElementById("progressbar").style.display = "none";
    tabs.style.display = "block";
}

//METADATA TAB

function createMetadata(){
    document.getElementById("dataset").innerHTML = model["dataset"];
    document.getElementById("topics").innerHTML = model["topics"];
    document.getElementById("iterations").innerHTML = model["iterations"];
    document.getElementById("alpha").innerHTML = model["alpha"];
    document.getElementById("beta").innerHTML = model["beta"];
    
    //testing stuff
    initializeHeatmaps();
    document.getElementById("stopwords-dialog").innerHTML = "<p>" + model.stopwords.join(", ") + "</p>";

    //create nicknames data structure
    model["nicknames"] = [];
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        model.nicknames.push("");
    }

    //dynamically create injectable HTML with dropdown options for each topic
    let topicDropdownHTMLmetadata = "<option disabled selected='selected' value='-1'>Select topic to display</option>";
    let topicDropdownHTMLnickname = "<option disabled selected>Select topic to nickname</option>";

    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLmetadata = topicDropdownHTMLmetadata + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
        topicDropdownHTMLnickname = topicDropdownHTMLnickname + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("metadata-topic-select").innerHTML = topicDropdownHTMLmetadata;
    document.getElementById("nickname-topic-select").innerHTML = topicDropdownHTMLnickname;
}

//Metadata selectmenu setup (with onchange function)
$(document).ready(function() {
    $("#metadata-topic-select").change(function () {
        let value = $("#metadata-topic-select option:selected").val();
        value = parseInt(value);
        console.log(value);
        let topicWordList = Object.keys(model.topicWordInstancesDict[value]);
        topicWordList = topicWordList.sort(function (a, b) {
            return model.topicWordInstancesDict[value][b] -
                model.topicWordInstancesDict[value][a];
        });
        document.getElementById("metadata-topic-preview-text").textContent = topicWordList.join(", ");
    });
    //changing the wordcloud
    $("#word-cloud-topic-select").change(function () {
        let topic = $("#word-cloud-topic-select option:selected").val();
        console.log(topic)
        createWordCloud(topic)
    });
});

//ANNOTATED TEXT TAB

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

    //create three identical selectors for three possible topic comparisons
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
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

    //iterate through full text and add each word as own span with topic as class
    for (docInText in model.wordsByLocationWithStopwords) {
        for (word in model.wordsByLocationWithStopwords[docInText]) {
            d3.select("#tab-3")
                .append("span")
                .text(model.wordsByLocationWithStopwords[docInText][word]+ " ")
                .attr("class", "topic-" + model.topicsByLocationWithStopwords[docInText][word])
                .on("mouseover", onHover)
                //.on("mouseover", tip.show)
                //.on("mouseout", tip.hide)
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
    //check to make sure we don't overwrite a selected topic
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
    //reset all spans to unselected
    d3.selectAll("span")
        .style("background-color", "white");

    //iterate through selectors and change background color for all spans with the corresponding class name
    for (i = 0; i < 3; i++) {
        selector = "an-text-topic-select-" + (i + 1);
        topic = ".topic-" + document.getElementById(selector).value;
        d3.selectAll(topic)
            .style("background-color", function() { return colors[i]; });
    }
}


//WORD CLOUD TAB

function createWordCloud(topicNum) {
    $("#word-cloud").empty();
    let svg_location = "#word-cloud", topic = topicNum;
    const width = $(document).width();
    const height = $(document).height();
    //this needs to not run every time
    let topicDropdownHTMLWordCloud = ""
    if (topicNum == -1) {
        topicDropdownHTMLWordCloud = "<option disabled selected='selected' value='-1'>Select topic for wordcloud</option>";
        topic = 0
    } else {
        topicDropdownHTMLWordCloud = "<option disabled selected=''selected value="+topic+">Topic " + String(parseInt(topic) + 1) + "</option>";
    }
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLWordCloud = topicDropdownHTMLWordCloud + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("word-cloud-topic-select").innerHTML = topicDropdownHTMLWordCloud;
    let fill = d3.schemeCategory20;
    // let word_entries = d3.entries(model.topicWordInstancesDict[topic]);
    let word_entries = d3.entries(model.topicWordInstancesDict[topic]).slice(0,600);
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

//Popup/Dialog setup

//Stopwords dialog setup
$( function() {
    let dialog = $( "#stopwords-dialog");
    dialog.dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            overflow: scroll
        }
    );

    $( "#view-stopwords").button().on( "click", function() {
        dialog.dialog("open");
    });
});

//Nickname dialog setup
$( function() {
    let dialog, form,
        topic = $( "#nickname-topic-select"),
        nickname = $( "#nickname-input" );

    dialog = $( "#nickname-dialog-form" ).dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        buttons: {
            Cancel: function() {
                dialog.dialog( "close");
            },
            "Nickname topic": addNickname
        },
        close: function() {
            form[ 0 ].reset();
        }
    });

    form = dialog.find( "form" ).on( "submit", function (event) {
        event.preventDefault();
        addNickname();
    });

    $( "#create-nickname").button().on( "click", function() {
        dialog.dialog("open");
    });

    function addNickname() {
        model.nicknames[topic.val()] = nickname.val();
        let toUpdate = document.getElementsByClassName("select-topic-" + topic.val());
        for (i = 0; i < toUpdate.length; i++){
            toUpdate[i].innerText = model.nicknames[topic.val()];
        }
        dialog.dialog("close");
    }
});

//JQuery-UI functions

//Progressbar function
$(function() {
    $( "#progressbar" ).progressbar({
        value: false
    });
});
//Tab switching function
$( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
} );
