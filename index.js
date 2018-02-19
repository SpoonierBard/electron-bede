let fs = require("fs"),
    model = {},
    input;
const colors  = ["#66c2a5", "#fc8d62", "#8da0cb"],
    scaledColors = ["hsl(161, 30%, 90%)", "hsl(17, 30%, 90%)", "hsl(222, 30%, 90%)", "hsl(161, 63%, 38%)", "hsl(17, 86%, 49%)", "hsl(222, 57%, 47%)"];


/**
 * Transitions from welcome page to config file creation page on button click
 */
function loadConfigForm(){
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("create-file-form").style.display = "block";
}

/**
 * Transitions from welcome page to json file upload page on button click
 */
function loadFileChoice() {
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("file-upload").style.display = "block";
}

/**
 * Creates a json file containing configuration parameters for LDA.py based on user choices
 */
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

    let filename = "./" + outputname + "-config.json";
    fs.writeFile(filename, JSON.stringify(config), (err) => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Reads model data from json file output from LDA.py
 */
//Function to read data from uploaded json file. Called on button click.
function loadFile() {
    hideUploadScreen();
    let reader;
    reader = new FileReader();
    input = document.getElementById("json-file");
    if (!input.files[0]) {
        alert("Please select a file before clicking upload");
    }
    else {
        reader.onload = (function() {
            model = JSON.parse(reader.result);
            createMetadata();
            initializeHeatmaps();
            createAnnotatedText();
            initializeWordCloudTab();
            loadTabs();
        });
        reader.readAsText(input.files[0]);
    }
}

/**
 * Transitions from json file upload page to progress bar
 */
function hideUploadScreen() {
    let uploadbox = document.getElementById("file-upload");
    uploadbox.style.display = "none";
    document.getElementById("progressbar").style.display = "block";
}

/**
 * Applies JQuery-UI styling and functionality to progress bar
 */
$(function() {
    $( "#progressbar" ).progressbar({
        value: false
    });
});

/**
 * Transitions from progress bar to tabs once they have finished loading
 */
function loadTabs() {
    let tabs = document.getElementById("tabs");
    document.getElementById("progressbar").style.display = "none";
    tabs.style.display = "block";
}

/**
 * Applies JQuery-UI styling and functionality to tabs
 */
$( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" )
        .find("li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
} );


//METADATA TAB

/**
 * Loads data into metadata tab
 */
function createMetadata(){
    document.getElementById("dataset").innerHTML = model["dataset"];
    document.getElementById("topics").innerHTML = model["topics"];
    document.getElementById("iterations").innerHTML = model["iterations"];
    document.getElementById("alpha").innerHTML = model["alpha"];
    document.getElementById("beta").innerHTML = model["beta"];
    
    document.getElementById("stopwords-dialog").innerHTML = "<p>" + model.stopwords.join(", ") + "</p>";

    //create nicknames data structure
    if (model["nicknames"] === null || model["nicknames"] === undefined) {
        model["nicknames"] = [];
        for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
            model.nicknames.push("Topic " + (i + 1));
        }
    }
    //dynamically create injectable HTML with dropdown options for each topic
    let topicDropdownHTMLmetadata = "<option disabled selected='selected' value='-1'>Select topic to display</option>";
    let topicDropdownHTMLnickname = "<option disabled selected>Select topic to nickname</option>";

    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLmetadata = topicDropdownHTMLmetadata + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
        topicDropdownHTMLnickname = topicDropdownHTMLnickname + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("metadata-topic-select").innerHTML = topicDropdownHTMLmetadata;
    document.getElementById("nickname-topic-select").innerHTML = topicDropdownHTMLnickname;
}

/**
 * Writes model data including new nicknames to original json file
 */
function saveNicknames() {
    fs.writeFile(input.files[0].path, JSON.stringify(model), (err) => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Loads new topic in metadata tab on dropdown change
 */
$(document).ready(function() {
    $("#metadata-topic-select").change(function () {
        let value = $("#metadata-topic-select").find("option:selected").val();
        value = parseInt(value);
        let topicWordList = Object.keys(model.topicWordInstancesDict[value]);
        topicWordList = topicWordList.sort(function (a, b) {
            return model.topicWordInstancesDict[value][b] -
                model.topicWordInstancesDict[value][a];
        });
        document.getElementById("metadata-topic-preview-text").textContent = topicWordList.join(", ");
    });
});

//Metadata popup/Dialog setup

/**
 * Initializes stopwords dialog
 */
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

/**
 * Initializes nickname selection dialog
 */
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
        for (let i = 0; i < toUpdate.length; i++){
            toUpdate[i].innerText = model.nicknames[topic.val()];
        }
        dialog.dialog("close");
    }
});





//ANNOTATED TEXT TAB

/**
 * Initializes annotated text tab with no topics selected
 * @param {number} startIndex -- //TODO: once this is used, say what it does
 */
function createAnnotatedText(startIndex) {
    let topicDropdownHTML = "<option disabled selected>Select Topic</option>";

    //create three identical selectors for three possible topic comparisons
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("an-text-topic-select-1").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-2").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-3").innerHTML = topicDropdownHTML;

    for(let i = 1; i < 4; i++) {
        d3.select("#an-text-topic-select-" + i)
            .style("background", function () {return colors[i - 1]; });
    }

    //iterate through full text and add each word as own span with topic as class
    let puncTracker = 0, //index of punctuation
        puncLocation = 0, //index of puncLocation
        puncLocTracker = 0, //where in text
        newlineTracker = 0, //index of newlines
        wordToApp;
    for (let docInText in model.wordsByLocationWithStopwords) {
        for (let word in model.wordsByLocationWithStopwords[docInText]) {
            wordToApp = model.wordsByLocationWithStopwords[docInText][word];
            if (puncLocTracker === model.puncCapLocations[puncLocation]) {
                wordToApp = model.puncAndCap[puncTracker];
                puncTracker += 1;
                puncLocation += 1;
            }
            while (puncLocTracker === model.newlineLocations[newlineTracker]) {
                wordToApp += '<br/>';
                newlineTracker += 1;
            }
            puncLocTracker += 1;
            d3.select("#an-text-body")
                .append("span")
                .html(wordToApp)
                // .text(wordToApp)
                .attr("class", "topic-" + model.topicsByLocationWithStopwords[docInText][word])
                .on("mouseover", onHover)
                .on("mouseout", offHover);
             d3.select('#an-text-body')
                .append("span")
                .text(" ");
        }
    }
}

/**
 * Displays tooltip of topic for word on hover; highlights other words in topic if check-highlight is checked
 */
function onHover() {
    d3.select(this)
        .attr("data-tooltip", function(){
            let topicindex = parseInt(this.className.split("-")[1]);
            if (this.className.split("-").length > 2) {
                return "stopword";
            }
            else if (model.nicknames[topicindex] !== "") {
                return model.nicknames[topicindex];
            } /*else {
                return "topic-" + (topicindex + 1);
            }*/
        });
    let topic = "." + this.className,
        selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value,
        selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value,
        selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    //check to make sure we don't overwrite a selected topic
    if ((selectedOne !== this.className) && (selectedTwo !== this.className) && (selectedThree !== this.className)) {
        //only apply if hover on highlight is checked
        if (document.getElementById("check-highlight").checked && this.className !== "topic--1") {
            d3.selectAll(topic)
                .style("background-color", "yellow")
        }
    }
}

/**
 * Unhighlights previously highlighted words when the mouse stops hovering over a word
 */
function offHover() {
    let topic = "." + this.className,
        selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value,
        selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value,
        selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    if ((selectedOne !== this.className) && (selectedTwo !== this.className) && (selectedThree !== this.className)) {
        d3.selectAll(topic)
            .style("background-color", "white");
    }
}

/**
 * Highlights all words in selected topic with the corresponding color of the dropdown
 */
function onSelect() {
    //reset all spans to unselected
    d3.selectAll("span")
        .style("background-color", "white");

    //iterate through selectors and change background color for all spans with the corresponding class name
    for (let i = 0; i < 3; i++) {
        let selector = "an-text-topic-select-" + (i + 1);
        let topic = ".topic-" + document.getElementById(selector).value;
        d3.selectAll(topic)
            .style("background-color", function() { return colors[i]; });
    }
}




//HEATMAP TAB

//TODO: @Adam and @Brendan, could you give inline comments on what these constants do?
let prevalenceArray = [],
    heatmapWidthPx = 500, //This is a constant that does... something
    heatmapResPx = 1, //This one too!
    heatmapSmoothing = 10,
    heatmapTopic1 = 0,
    heatmapTopic2 = 1,
    heatmapTopic3 = 2;



$(document).ready(function() {
    /**
     * Reloads heatmap on corresponding dropdown change
     */
    $( "#heatmap1Menu" ).change(function () {
        heatmapTopic1 = $("#heatmap1Menu").find("option:selected").val();
        replaceHeatmap(1, heatmapTopic1);
    });
    $( "#heatmap2Menu" ).change(function () {
        heatmapTopic2 = $("#heatmap2Menu").find("option:selected").val();
        replaceHeatmap(2, heatmapTopic2);
    });
    $( "#heatmap3Menu" ).change(function () {
        heatmapTopic3 = $("#heatmap3Menu").find("option:selected").val();
        replaceHeatmap(3, heatmapTopic3);
    });
    /**
     * Reloads heatmaps taking into account whether a smoothing constant is being applied on checkbox change
     */
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
    /**
     * Reloads heatmaps taking into account the new smoothing constant on dropdown change
     */
    $("#smoothingSelect").change(function () {
        heatmapSmoothing = parseInt($("#smoothingSelect").val());
        replaceHeatmap(1,heatmapTopic1);
        replaceHeatmap(2,heatmapTopic2);
        replaceHeatmap(3,heatmapTopic3);
    });
});

/**
 * Creates an array representing the distribution of a particular topic across corpus
 * @param {number} topic -- topic whose distribution array will represent
 * @returns {number[]} -- array representing topic distribution across corpus
 */
function createPrevalenceArray(topic) {
    let innerArray = [];
    for (let i = 0; i < model.wordsByLocationWithStopwords.length; i++) {
        for (let j = 0; j < model.wordsByLocationWithStopwords[i].length; j++) {
            if (model.topicsByLocationWithStopwords[i][j] === topic) {
                innerArray.push(1);
            } else {
                innerArray.push(0);
            }
        }
        prevalenceArray.push(innerArray);
        innerArray = [];
    }

    let binnedArray = [0],
        totalLength = 0;
    for (let i = 0; i < prevalenceArray.length; i++) {
        totalLength += prevalenceArray[i].length;
    }
    let binSize = Math.floor(totalLength/(heatmapWidthPx/heatmapResPx)),
        countDown = binSize,
        curIndex = 0;
    for (let i = 0; i < prevalenceArray.length; i++) {
        for (let j = 0; j < prevalenceArray[i].length; j++) {
            countDown--;
            binnedArray[curIndex] += prevalenceArray[i][j];

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

/**
 * Creates an array with smoother prevalence transitions from an original array
 * @param {number[]} originalArray -- array to be smoothed
 * @param {number} smoothingRadius -- amount of smoothing
 * @returns {number[]} -- array after smoothing
 */
function smoothArray(originalArray, smoothingRadius) {
    let smoothedArray =
        Array.apply(null, Array(originalArray.length)).map(Number.prototype.valueOf,0);
    for (let i = 0; i < originalArray.length; i++) {
        if (originalArray[i] !== 0) {
            for (let j = (i - smoothingRadius + 1); j < i + smoothingRadius; j++) {
                if ((j >= 0) && (j <= i)) {
                    smoothedArray[j] +=
                        originalArray[i]*(smoothingRadius - (i - j));
                }
                if ((j > i)&&(j < originalArray.length)) {
                    smoothedArray[j] +=
                        originalArray[i]*(smoothingRadius + (i - j));
                }
            }
        }
    }
    return smoothedArray;
}

/**
 * Initializes heatmap tab
 */
function initializeHeatmaps() {
//    d3.select("#heatmap1Menu").selectAll("option")
//    .data(model.topicList).enter()
//    .append("option")
//        .text(function (d) {return d})
    let topicDropdownHTML = "<option disabled>Select Topic</option>";
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("heatmap1Menu").innerHTML = topicDropdownHTML;
    $('#heatmap1Menu').find('option')[1].selected = true;
    document.getElementById("heatmap2Menu").innerHTML = topicDropdownHTML;
    $('#heatmap2Menu').find('option')[2].selected = true;
    document.getElementById("heatmap3Menu").innerHTML = topicDropdownHTML;
    $('#heatmap3Menu').find('option')[3].selected = true;

    for (let iter = 1; iter < 4; iter++){
        let topic = eval("heatmapTopic" + iter);

        changeTop5Words(iter, (iter - 1));

        let svg = d3.select("#heatmapSVG" + iter);
        svg.style("width", function(){
            return heatmapWidthPx*1.5 + "px"
        });
        svg.style("height", 50);

        let binnedArray = createPrevalenceArray(topic);
        binnedArray = smoothArray(binnedArray, heatmapSmoothing);

        drawRectangles(svg, binnedArray, iter);
    }
}

/**
 * Reloads top 5 words of topic
 * @param {number} heatmapNum -- which heatmap to update
 * @param {number} topic -- which topic to load
 */
function changeTop5Words(heatmapNum, topic) {
    //var topic = eval("heatmapTopic" + heatmapNum);
    let topicWords = Object.keys(model.topicWordInstancesDict[topic]),
        sortedWords = topicWords.sort(function(a,b){
        return model.topicWordInstancesDict[topic][b] - model.topicWordInstancesDict[topic][a];
    });
    let top5Words = ": ";
    for (let j = 0; j < 4; j++) {
        top5Words = top5Words + sortedWords[j] + ", ";
    }
    top5Words = top5Words + sortedWords[4];
    d3.select("#topicLabel" + heatmapNum).text(top5Words)
}

/**
 * Draws rectangles representing the values in an array
 * @param svg -- where to draw the rectangles
 * @param {number[]} dataset -- array representing topic distribution
 * @param {number} heatmapNum -- which heatmap to draw the rectangles in
 */
function drawRectangles(svg, dataset, heatmapNum) {
    let colorScale = d3.scaleLinear()
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

/**
 * Reloads a given heatmap with a new topic
 * @param {number} heatmapNum -- which heatmap to update
 * @param {number] topic -- which topic to load
 */
function replaceHeatmap(heatmapNum, topic) {
    var svg = d3.select("#heatmapSVG" + heatmapNum);
    svg.html("");
    let heatmapArray = createPrevalenceArray(topic);
    heatmapArray = smoothArray(heatmapArray, heatmapSmoothing);
    drawRectangles(svg, heatmapArray, heatmapNum);
    changeTop5Words(heatmapNum, topic);
}




//WORD CLOUD TAB

/**
 * Intializes word cloud tab with Topic 1 selected
 */
function initializeWordCloudTab() {
    let topicDropdownHTMLWordCloud = "<option disabled selected='selected' value='-1'>Select topic for wordcloud</option>";
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLWordCloud = topicDropdownHTMLWordCloud + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("word-cloud-topic-select").innerHTML = topicDropdownHTMLWordCloud;
    createWordCloud(0);
}

/**
 * Reloads word cloud based on a new topic
 * @param {number} topicNum -- topic to be displayed
 */
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
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(filtered_entries, function(d) {
            return d.value;
        })
        ])
        .range([10,100]);
    d3.layout.cloud()
        .size([width, height])
        .timeInterval(20)
        .words(filtered_entries)
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

/**
 * Loads new word cloud on dropdown change
 */
$(document).ready (function () {
    $("#word-cloud-topic-select").change(function () {
        let topic = $("#word-cloud-topic-select").find("option:selected").val();
        createWordCloud(topic)
    });
});

