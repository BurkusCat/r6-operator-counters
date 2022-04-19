'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let doc = new Operator(r6operators.doc, operatorId.doc, "N/A");

doc.addCounterNode(operatorId.capitao, counterType.minor, "Doc's stim pistol can heal damage done by Capitão's asphyxiation bolts.");
doc.addCounterNode(operatorId.twitch, counterType.minor, "Doc's stim pistol can heal damage done by Twitch's Shock Drone.");

export default doc