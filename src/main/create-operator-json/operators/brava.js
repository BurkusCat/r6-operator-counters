'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let brava = new Operator(r6operators.brava, operatorId.brava, "Operation Commanding Force");

brava.addCounterNode(operatorId.alibi, counterType.minor, "Brava's Krudge drone can hack Alibi's prismas");
brava.addCounterNode(operatorId.aruni, counterType.hard, "Brava's Krudge drone can hack Aruni's surya gates")
brava.addCounterNode(operatorId.echo, counterType.hard, "Brava's Krudge drone can hack Echo's yokai drone and controll it")
brava.addCounterNode(operatorId.ela, counterType.hard, "Brava's Krudge drone can hack Ela's grzmot mines")
brava.addCounterNode(operatorId.jager, counterType.hard, "Brava's Krudge drone can hack Jager's ADS")
brava.addCounterNode(operatorId.kapkan, counterType.hard, "Brava's Krudge drone can hack Kapkan's EDDs")
brava.addCounterNode(operatorId.maestro, counterType.hard, "Brava's Krudge drone can hack Maestro's evil eye and controll it")
brava.addCounterNode(operatorId.melusi, counterType.hard, "Brava's Krudge drone can hack Melusi's banshee")
brava.addCounterNode(operatorId.mozzie, counterType.minor, "Brava's Krudge drone can hack Mozzie's pests")
brava.addCounterNode(operatorId.mute, counterType.major, "Brava's Krudge drone can hack Mute's jammers")
brava.addCounterNode(operatorId.thorn, counterType.major, "Brava's Krudge drone can hack Thorn's razorblooms")
brava.addCounterNode(operatorId.valkyrie, counterType.major, "Brava's Krudge drone can hack Valkyrie's black eyes")


export default brava