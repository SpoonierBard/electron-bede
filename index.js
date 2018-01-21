//TODO: add drag/drop capability for file upload

//Function to read data from uploaded json file. Called on button click.
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
            data = JSON.parse(data);

            //load all the data directly into the metadata tab or as universally accessible json objects
            document.getElementById("dataset").innerHTML = data["dataset"];
            document.getElementById("topics").innerHTML = data["topics"];
            document.getElementById("iterations").innerHTML = data["iterations"];
            document.getElementById("alpha").innerHTML = data["alpha"];
            document.getElementById("beta").innerHTML = data["beta"];
            const wordsByLocation = data["wordsByLocation"];
            const topicsByLocation = data["topicsByLocation"];
            const wordCounts = data["wordCounts"];
            const wordTopicCounts = data["wordTopicCounts"];
            const topicList = data["topicList"];
            const topicWordCounts = data["topicWordCounts"];
            const docList = data["docList"];
            const docWordCounts = data["docWordCounts"]
        });
        reader.readAsText(input.files[0]);
    }
}

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