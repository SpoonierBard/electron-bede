//TODO: add drag/drop capability for file upload

let model;
//Function to read data from uploaded json file. Called on button click. Saves data to localstorage as a string.
function loadFile() {
    hideUploadScreen();
    let input, reader, data;
    reader = new FileReader();
    input = document.getElementById("json-file");
    if (!input.files[0]) {
        console.log("Please select a file before clicking upload");
    }
    else {
        reader.onload = (function() {
            data = reader.result;
            try {
                localStorage.setItem("model", data);
            }
            catch (e) {
                console.log("Storage failed: " + e);
            }});
        reader.readAsText(input.files[0]);
    }
    model = JSON.parse(localStorage.getItem("model"));
    //load all the data directly into the metadata tab or as universally accessible json objects
    document.getElementById("dataset").innerHTML = model["dataset"];
    document.getElementById("topics").innerHTML = model["topics"];
    document.getElementById("iterations").innerHTML = model["iterations"];
    document.getElementById("alpha").innerHTML = model["alpha"];
    document.getElementById("beta").innerHTML = model["beta"];
    //document.getElementById("topicsByLocWithStopwords").innerHTML = model["topicsByLocationWithStopwords"];
    let fullText = '';
    for (docInText in model.wordsByLocationWithStopwords) {
        console.log(docInText)
        for (word in model.wordsByLocationWithStopwords[docInText]) {
            fullText += model.wordsByLocationWithStopwords[docInText][word] + "<br>";
        }
    }
    document.getElementById("fullText").innerHTML = fullText;
}

//Progress from welcome screen to data visualization tabs
function hideUploadScreen() {
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

function createAnnotatedText() {
    for (word in "wordByLocWithStopwords") {
        fullText += word + "<br>";
    }
    document.getElementById("fullText").innerHTML = fullText;
}
