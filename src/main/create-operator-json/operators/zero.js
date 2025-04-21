'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let zero = new Operator(r6operators.zero, operatorId.zero, "Operation Shadow Legacy");

zero.addCounterNode(operatorId.alibi, counterType.hard, "Zero's Argus camera can destroy Alibi's prismas.");
zero.addCounterNode(operatorId.echo, counterType.hard, "Zero's Argus camera can destroy Echo's Yokai drones.");
zero.addCounterNode(operatorId.valkyrie, counterType.hard, "Zero's Argus camera can destroy Valkyrie's Black Eye cameras.");
zero.addCounterNode(operatorId.maestro, counterType.hard, "Zero's Argus camera can destroy Maestro's Evil eye, while it is open.");
zero.addCounterNode(operatorId.thunderbird, counterType.hard, "Zero's Argus camera can destroy Thunderbird's Kona Station.");
zero.addCounterNode(operatorId.bandit, counterType.hard, "Zero's Argus camera can destroy Bandit's shock wires.");
zero.addCounterNode(operatorId.goyo, counterType.hard, "Zero's Argus camera can destroy Goyo's Volcán Canisters.");
zero.addCounterNode(operatorId.jager, counterType.hard, "Zero's Argus camera can destroy Jäger's ADS, if not intercepted by the ADS.");
zero.addCounterNode(operatorId.kaid, counterType.hard, "Zero's Argus camera can destroy Kaid's Electroclaws.");
zero.addCounterNode(operatorId.kapkan, counterType.hard, "Zero's Argus camera can destroy Kapkan's EDDs.");
zero.addCounterNode(operatorId.mozzie, counterType.hard, "Zero's Argus camera can destroy Mozzie's Pests or the Attacker Drones captured by them.");

export default zero
