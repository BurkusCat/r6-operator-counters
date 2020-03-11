'use strict';

import alibi from '../operators/alibi';
import amaru from '../operators/amaru';
import ash from '../operators/ash';
import bandit from '../operators/bandit';
import blackbeard from '../operators/blackbeard';
import blitz from '../operators/blitz';
import buck from '../operators/buck';
import capitao from '../operators/capitao';
import castle from '../operators/castle';
import caviera from '../operators/caviera';
import clash from '../operators/clash';
import doc from '../operators/doc';
import dokkaebi from '../operators/dokkaebi';
import echo from '../operators/echo';
import ela from '../operators/ela';
import finka from '../operators/finka';
import frost from '../operators/frost';
import fuze from '../operators/fuze';
import glaz from '../operators/glaz';
import goyo from '../operators/goyo';
import gridlock from '../operators/gridlock';
import hibana from '../operators/hibana';
import iq from '../operators/iq';
import jackal from '../operators/jackal';
import jager from '../operators/jager';
import kaid from '../operators/kaid';
import kapkan from '../operators/kapkan';
import lesion from '../operators/lesion';
import lion from '../operators/lion';
import maestro from '../operators/maestro';
import maverick from '../operators/maverick';
import mira from '../operators/mira';
import montagne from '../operators/montagne';
import mozzie from '../operators/mozzie';
import mute from '../operators/mute';
import nokk from '../operators/nokk';
import nomad from '../operators/nomad';
import pulse from '../operators/pulse';
import recruit from '../operators/recruit';
import rook from '../operators/rook';
import sledge from '../operators/sledge';
import smoke from '../operators/smoke';
import tachanka from '../operators/tachanka';
import thatcher from '../operators/thatcher';
import thermite from '../operators/thermite';
import twitch from '../operators/twitch';
import valkyrie from '../operators/valkyrie';
import vigil from '../operators/vigil';
import warden from '../operators/warden';
import ying from '../operators/ying';
import zofia from '../operators/zofia';

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
    ela: ela,
    echo: echo,
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
