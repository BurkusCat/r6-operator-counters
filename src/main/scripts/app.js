import Neo4jD3 from './neo4jd3.js';
import ImageLocation from './imageLocation.js'

// local storage and default settings initialisation
var highAccuracySimulation = true;
if(localStorage.getItem('highAccuracySimulation') !== null) {
    highAccuracySimulation = localStorage.getItem('highAccuracySimulation') === 'true';
} else {
    localStorage.setItem('highAccuracySimulation', highAccuracySimulation);
}
let neo4jd3;
let neo4jd3Options = {
        highlight: [
        ],
        icons: {
        },
        minCollision: 80,
        neo4jDataUrl: 'json/r6OperatorCounters.json',
        nodeRadius: 35,
        counters: [
            document.querySelector('#hardCounters').checked,
            document.querySelector('#softCounters').checked,
            document.querySelector('#minorCounters').checked
        ],
        onNodeDoubleClick: focusOnNode,
        onRelationshipDoubleClick: focusOnRelationship,
        zoomFit: false,
        simulationQuality: highAccuracySimulation ? 2 : 1
    };

//event listeners to handle clicks, module is not global scoped
document.getElementById('hardCounters').addEventListener('click', init);
document.getElementById('softCounters').addEventListener('click', init);
document.getElementById('minorCounters').addEventListener('click', init);
document.getElementById('startButton').addEventListener('click', unfreezeAllNodes);
document.getElementById('stopButton').addEventListener('click', freezeAllNodes);
document.getElementById('highAccuracySimulationButton').addEventListener('click', toggleSimulationAccuracy);
document.getElementById('toolsButton').addEventListener('click', toggleSettingsPopup);

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var settingsPopup = document.getElementById("settingsPopup");
var highAccuracySimEnabledLabel = document.getElementById("highAccuracySimEnabledLabel");
var highAccuracySimDisabledLabel = document.getElementById("highAccuracySimDisabledLabel");

var focused = false;

function init() {
    // start the simulation again if the user changes something
    startButton.style.display = "none";
    stopButton.style.display = "block";

    neo4jd3Options.counters = [
        document.querySelector('#hardCounters').checked,
        document.querySelector('#softCounters').checked,
        document.querySelector('#minorCounters').checked,
    ];
    neo4jd3Options.simulationQuality = highAccuracySimulation ? 2 : 1;

    if (neo4jd3) {
        // stop any old simulation running
        neo4jd3.stopSimulation();
    }

    neo4jd3 = new Neo4jD3('#neo4jd3', neo4jd3Options);

    document.querySelector('.neo4jd3-graph').addEventListener('click', unfocus);
}

function focusOnNode(node) {
    let connectedNodes = new Set();
    connectedNodes.add(node.id);

    // Decrease opacity on counters not connected to node and get set of nodes directly connected to node
    Array.from(document.querySelectorAll('.relationship'))
        .filter(counter => {
            if (counter.__data__.startNode == node.id) connectedNodes.add(counter.__data__.endNode);
            else if (counter.__data__.endNode == node.id) connectedNodes.add(counter.__data__.startNode);
            return counter.__data__.startNode != node.id && counter.__data__.endNode != node.id;
        })
        .forEach(counter => counter.classList.add("unfocused"));

    // Decrease opacity on nodes not directly connected to node
    Array.from(document.querySelectorAll('.node'))
        .filter(nodeElem => !connectedNodes.has(nodeElem.__data__.id) )
        .forEach(nodeElem => nodeElem.classList.add("unfocused"));

    focused = true;
}

function focusOnRelationship(relationship) {
    let nodes = [relationship.startNode, relationship.endNode];

    // Decrease opacity of nodes not connected to relationship
    Array.from(document.querySelectorAll('.node'))
        .filter(node => !nodes.includes(node.__data__.id))
        .forEach(node => node.classList.add("unfocused"));

    // Decrease opacity of other relationships
    Array.from(document.querySelectorAll('.relationship'))
        .filter(counter => counter.__data__.id != relationship.id)
        .forEach(counter => counter.classList.add("unfocused"));

    focused = true;
}

function unfocus() {
    // close the settings popup
    settingsPopup.style.display = "none";

    // if we are focused on a node or relationship, unfocus the graph
    if (focused) {
        Array.from(document.querySelectorAll('.relationship, .node'))
            .forEach(counter => counter.classList.remove("unfocused"));
        focused = false;
    }
}

function toggleSettingsPopup() {
    if (settingsPopup.style.display === "block") {
        settingsPopup.style.display = "none";
    } else {
        settingsPopup.style.display = "block";
    }
}

function unfreezeAllNodes() {
    // switch the buttons to show
    startButton.style.display = "none";
    stopButton.style.display = "block";

    neo4jd3.unfreezeAllNodes();
}

function freezeAllNodes() {
    // switch the buttons to show
    stopButton.style.display = "none";
    startButton.style.display = "block";

    neo4jd3.freezeAllNodes();
}

function setAccuracySimLabels() {
    if (highAccuracySimulation) {
        highAccuracySimEnabledLabel.style.display = "block";
        highAccuracySimDisabledLabel.style.display = "none";
    } else {
        highAccuracySimEnabledLabel.style.display = "none";
        highAccuracySimDisabledLabel.style.display = "block";
    }
}

function toggleSimulationAccuracy() {
    highAccuracySimulation = !highAccuracySimulation;

    setAccuracySimLabels();

    localStorage.setItem('highAccuracySimulation', highAccuracySimulation);

    // re-load the graph with the new simulation quality
    init();
}

function setImages() {
    var fileFormat = 'svg';

    neo4jd3Options.images = ImageLocation.getLocations(fileFormat);

    // re-load the graph with new images
    init();
}

// set the simulation accuracy label
setAccuracySimLabels();
window.onload = setImages;