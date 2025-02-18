'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let solis = new Operator(r6operators.solis, operatorId.solis, "Operation Solar Raid");

solis.addCounterNode(operatorId.blitz, counterType.hard, "Solis' visor can detect Blitz's shield while being held and therefore his position.");
solis.addCounterNode(operatorId.jackal, counterType.hard, "Solis' visor can detect Jackel's goggles while active.");
solis.addCounterNode(operatorId.nomad, counterType.soft, "Solis' visor can detect Nomad's airjabs.");
solis.addCounterNode(operatorId.brava, counterType.hard, "Solis' visor can detect and track Brava's krudge drone.");

export default solis