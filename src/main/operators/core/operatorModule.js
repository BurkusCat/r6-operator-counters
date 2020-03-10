import alibi from '../alibi';
import amaru from '../amaru';
import ash from '../ash';
import bandit from '../bandit';
import blackbeard from '../blackbeard';
import blitz from '../blitz';
import buck from '../buck';
import capitao from '../capitao';
import castle from '../castle';
import caviera from '../caviera';
import clash from '../clash';
import doc from '../doc';
import dokkaebi from '../dokkaebi';
import echo from '../echo';
import ela from '../ela';
import finka from '../finka';
import frost from '../frost';
import fuze from '../fuze';
import glaz from '../glaz';
import goyo from '../goyo';
import gridlock from '../gridlock';
import hibana from '../hibana';
import iq from '../iq';
import jackal from '../jackal';
import jager from '../jager';
import kaid from '../kaid';
import kapkan from '../kapkan';
import lesion from '../lesion';
import lion from '../lion';
import maestro from '../maestro';
import maverick from '../maverick';
import mira from '../mira';
import montagne from '../montagne';
import mozzie from '../mozzie';
import mute from '../mute';
import nokk from '../nokk';
import nomad from '../nomad';
import pulse from '../pulse';
import recruit from '../recruit';
import rook from '../rook';
import sledge from '../sledge';
import smoke from '../smoke';
import tachanka from '../tachanka';
import thatcher from '../thatcher';
import thermite from '../thermite';
import twitch from '../twitch';
import valkyrie from '../valkyrie';
import vigil from '../vigil';
import warden from '../warden';
import ying from '../ying';
import zofia from '../zofia';

let jsonObject = {
    results: [{
        columns: ["user", "entity"],
        data: [{
            graph: {
                nodes: [],
                relationships: []
            }
        }]
    }],
    errors: [],
};

const operators = {
    alibi: alibi,
    amaru: amaru,
    ash: ash,
    bandit: bandit,
    blackbeard: blackbeard,
    blitz: blitz,
    buck: buck,
    capitao: capitao,
    castle: castle,
    caviera: caviera,
    clash: clash,
    doc: doc,
    dokkaebi: dokkaebi,
    echo: echo,
    ela: ela,
    finka: finka,
    frost: frost,
    fuze: fuze,
    glaz: glaz,
    goyo: goyo,
    gridlock: gridlock,
    hibana: hibana,
    iq: iq,
    jackal: jackal,
    jager: jager,
    kaid: kaid,
    kapkan: kapkan,
    lesion: lesion,
    lion: lion,
    maestroo: maestro,
    maverick: maverick,
    mira: mira,
    montagne: montagne,
    mozzie: mozzie,
    mute: mute,
    nokk: nokk,
    nomad: nomad,
    pulse: pulse,
    recruit: recruit,
    rook: rook,
    sledge: sledge,
    smoke: smoke,
    tachanka: tachanka,
    thatcher: thatcher,
    thermite: thermite,
    twitch: twitch,
    valkyrie: valkyrie,
    vigil: vigil,
    warden: warden,
    ying: ying,
    zofia: zofia
}

const operatorsList = Object.values(operators);
let relationshipId = 0;

for(let person in operatorsList) {

    let operatorRelationships = operatorsList[person].getCounters();
    // push operator info into node info
    jsonObject.results[0].data[0].graph.nodes.push(operatorsList[person].getInformation())
     
    // loop through all relationships for each operator
    for(let relation in operatorRelationships) {
        // add an id field onto the relationships
        operatorRelationships[relation].id = relationshipId;
        jsonObject.results[0].data[0].graph.relationships.push(operatorRelationships[relation]);
        relationshipId++;
    }

}
console.log(jsonObject.results[0].data[0].graph.relationships);
export default jsonObject;
