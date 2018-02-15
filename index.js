//TODO: add drag/drop capability for file upload
//This variable is global because it will contain all our data
let fs = require("fs");
let model = {};

function loadConfigForm(){
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("create-file-form").style.display = "block";
}

function loadFileChoice() {
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("file-upload").style.display = "block";
}

function createConfigFile(){
    let source, iterations, topics, outputname, upperlimit, lowerlimit,
        whitelist, blacklist, numberofdocuments, lengthofdocuments,
        splitstring, alpha, beta;

    let englishStopwords = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards",
        "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also",
        "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone",
        "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't",
        "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be",
        "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being",
        "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by",
        "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly",
        "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering",
        "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d",
        "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't",
        "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere",
        "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone",
        "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five",
        "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further",
        "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got",
        "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't",
        "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein",
        "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit",
        "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc",
        "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is",
        "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know",
        "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let",
        "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may",
        "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must",
        "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither",
        "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally",
        "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay",
        "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our",
        "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per",
        "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite",
        "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively",
        "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see",
        "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious",
        "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some",
        "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon",
        "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take",
        "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their",
        "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore",
        "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think",
        "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru",
        "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying",
        "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon",
        "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via",
        "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome",
        "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where",
        "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which",
        "while", "whilst", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing",
        "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you",
        "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"];

    let latinStopwords = ["ab", "ac", "ad", "adhic", "aliqui", "aliquis", "an", "ante", "apud", "at", "atque", "aut", "autem", "cum",
        "cur", "de", "deinde", "dum", "ego", "enim", "ergo", "es", "est", "et", "etiam", "etsi", "ex", "fio", "haud",
        "hic", "iam", "idem", "igitur", "ille", "in", "infra", "inter", "interim", "ipse", "is", "ita", "magis", "modo",
        "mox", "nam", "ne", "nec", "necque", "neque", "nisi", "non", "nos", "o", "ob", "per", "possum", "post", "pro",
        "quae", "quam", "quare", "qui", "quia", "quicumque", "quidem", "quilibet", "quis", "quisnam", "quisquam",
        "quisque", "quisquis", "quo", "quoniam", "sed", "si", "sic", "sive", "sub", "sui", "sum", "super", "suus",
        "tam", "tamen", "trans", "tu", "tum", "ubi", "uel", "uero", "unus", "ut"];

    source = document.getElementById("create-file-source").value;
    iterations = document.getElementById("create-file-iterations").value;
    topics = document.getElementById("create-file-topics").value;
    outputname = document.getElementById("create-file-output").value;
    upperlimit = parseInt(document.getElementById("create-file-upperlimit").value) / 100;
    lowerlimit = parseInt(document.getElementById("create-file-lowerlimit").value) / 100;
    whitelist = document.getElementById("create-file-whitelist").value.split();
    blacklist = document.getElementById("create-file-blacklist").value.split();

    if (document.getElementById("create-file-default-english-stopwords").value === "true"){
        blacklist.push.apply(blacklist, englishStopwords);
    }
    if (document.getElementById("create-file-default-english-stopwords").value === "true"){
        blacklist.push.apply(blacklist, latinStopwords);
    }

    if(document.getElementById("chunking-number").checked) {
        numberofdocuments = document.getElementById("create-file-number-documents").value;
        lengthofdocuments = "off";
        splitstring = "off";
    } else if (document.getElementById("chunking-length").checked) {
        numberofdocuments = "off";
        lengthofdocuments = document.getElementById("create-file-length-documents").value;
        splitstring = "off";
    } else if (document.getElementById("chunking-splitstring").checked) {
        numberofdocuments = "off";
        lengthofdocuments = "off";
        splitstring = document.getElementById("create-file-split-string").value;
    }
    alpha = document.getElementById("create-file-alpha").value;
    beta = document.getElementById("create-file-beta").value;

    let config = {}, reqparam = {}, stoptions = {}, choptions = {}, hyperparameters = {};
    reqparam["source"] = source;
    reqparam["iterations"] = iterations;
    reqparam["topics"] = topics;
    reqparam["output name"] = outputname;
    stoptions["upper limit"] = upperlimit;
    stoptions["lower limit"] = lowerlimit;
    stoptions["whitelist"] = whitelist;
    stoptions["blacklist"] = blacklist;
    choptions["number of documents"] = numberofdocuments;
    choptions["length of documents"] = lengthofdocuments;
    choptions["split string"] = splitstring;
    hyperparameters["alpha"] = alpha;
    hyperparameters["beta"] = beta;

    config["required parameters"] = reqparam;
    config["stopword options"] = stoptions;
    config["chunking options"] = choptions;
    config["hyperparameters"] = hyperparameters;

    fs.writeFile("./config.json", JSON.stringify(config), (err) => {
        if (err) {
            console.error(err);
        }
    });
}
var colors  = ["#66c2a5", "#fc8d62", "#8da0cb"];
//Function to read data from uploaded json file. Called on button click.
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
            initializeWordCloudTab();
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

function initializeWordCloudTab() {
    topicDropdownHTMLWordCloud = "<option disabled selected='selected' value='-1'>Select topic for wordcloud</option>";
    for (i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLWordCloud = topicDropdownHTMLWordCloud + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">Topic " + (i + 1) + "</option>";
    }
    document.getElementById("word-cloud-topic-select").innerHTML = topicDropdownHTMLWordCloud;
    createWordCloud(0);
}
function createWordCloud(topicNum) {
    $("#word-cloud").empty();
    let svg_location = "#word-cloud", topic = topicNum;
    const width = $(document).width();
    const height = $(document).height();
    let fill = d3.schemeCategory20;
    let word_entries = model.topicWordInstancesDict[topic];
    //filtered_entries contains every element of word_entries witha count greater than 1
    let filtered_entries = d3.entries(Object.keys(word_entries).reduce(function (new_dict, key) {
        if (word_entries[key] > 1 && key.length > 2) new_dict[key] = word_entries[key];
        return new_dict;
    }, {}));
    reduced_entries = filtered_entries.slice(0,Math.min(filtered_entries.length, 600));
    console.log("length:" + reduced_entries.length);
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(reduced_entries, function(d) {
            return d.value;
        })
        ])
        .range([10,100]);
    d3.layout.cloud()
        .size([width, height])
        .timeInterval(20)
        .words(reduced_entries)
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
