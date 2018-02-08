//TODO: add drag/drop capability for file upload

//This variable is global because it will contain all our data
let model = {};

//Function to read data from uploaded json file.
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
        //Call tab setup code here so that model is already  filled with data from file
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
        topicDropdownHTMLmetadata = topicDropdownHTMLmetadata + "<option id=\"metadata-select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
        topicDropdownHTMLnickname = topicDropdownHTMLnickname + "<option id=\"nickname-select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
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
    for (i = 0; i < model.topics; i++) {
        d3.select("#tab-3-buttons")
            .append("input")
            .attr("type", "button")
            .attr("name", "toggle")
            .attr("value", "Topic " + String(i+1))
            .on("click", togglePressed);
    }
    for (docInText in model.wordsByLocationWithStopwords) {
        for (word in model.wordsByLocationWithStopwords[docInText]) {
            d3.select("#tab-3")
                .append("span")
                .text(model.wordsByLocationWithStopwords[docInText][word]+ " ")
                .attr("class", "topic-" + model.topicsByLocationWithStopwords[docInText][word])
                .on("mouseover", highlightTopic)
                .on("mouseout", unhighlightTopic);
        }
    }
}

function togglePressed() {
    topicNum = this.value.slice(-1);
    topic = ".topic-" + topicNum;
    // add toggle!
    d3.selectAll(topic)
        .style("background-color", "orange");
}

function highlightTopic() {
    topic = "." + this.className;
    d3.selectAll(topic)
        .style("background-color", "aqua");
}

function unhighlightTopic() {
    topic = "." + this.className;
    d3.selectAll(topic)
        .style("background-color", "white");
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
        topicDropdownHTMLWordCloud = topicDropdownHTMLWordCloud + "<option id=\"word-cloud-select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
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
            "Nickname topic": addNickname,
            Cancel: function() {
                dialog.dialog( "close");
            }
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
        document.getElementById("nickname-select-topic-" + topic.val()).innerText = model.nicknames[topic.val()];
        document.getElementById("metadata-select-topic-" + topic.val()).innerText = model.nicknames[topic.val()];
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
