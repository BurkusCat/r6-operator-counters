'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let brava = new Operator(r6operators.brava, operatorId.brava, "Operation Commanding Force");

brava.addCounterNode(operatorId.alibi, counterType.minor, "Brava's Krudge drone can hack Alibi's Prismas.");
brava.addCounterNode(operatorId.aruni, counterType.hard, "Brava's Krudge drone can hack Aruni's Surya laser gates.");
brava.addCounterNode(operatorId.echo, counterType.hard, "Brava's Krudge drone can hack Echo's Yokai drone and control it.");
brava.addCounterNode(operatorId.ela, counterType.soft, "Brava's Krudge drone can hack Ela's Grzmot mines.");
brava.addCounterNode(operatorId.jager, counterType.soft, "Brava's Krudge drone can hack Jager's ADS.");
brava.addCounterNode(operatorId.kapkan, counterType.soft, "Brava's Krudge drone can hack Kapkan's EDDs.");
brava.addCounterNode(operatorId.maestro, counterType.hard, "Brava's Krudge drone can hack Maestro's Evil Eye and control it.");
brava.addCounterNode(operatorId.melusi, counterType.hard, "Brava's Krudge drone can hack Melusi's Banshee.");
brava.addCounterNode(operatorId.mozzie, counterType.minor, "Brava's Krudge drone can hack Mozzie's Pests.");
brava.addCounterNode(operatorId.mute, counterType.hard, "Brava's Krudge drone can hack Mute's Jammers.");
brava.addCounterNode(operatorId.thorn, counterType.hard, "Brava's Krudge drone can hack Thorn's Razorblooms.");
brava.addCounterNode(operatorId.valkyrie, counterType.hard, "Brava's Krudge drone can hack Valkyrie's black eyes.");
brava.addCounterNode(operatorId.fenrir, counterType.hard, "Brava's Krudge drone can hack Fenrir's Dread Mines.");
brava.addCounterNode(operatorId.skopos, counterType.hard, "Brava's Krudge drone can destroy Skopos' inactive shell.");

export default brava