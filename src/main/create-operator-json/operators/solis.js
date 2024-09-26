'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let solis = new Operator(r6operators.solis, operatorId.solis, "Operation Solar Raid");

solis.addCounterNode(r6operators.blitz, counterType.hard, "Solis' visor can detect Blitz's shield while being held and therefore him.")
solis.addCounterNode(r6operators.jackal, counterType.hard, "Solis' visor can detect Jackel's helmet while active.")
solis.addCounterNode(r6operators.nomad, counterType.soft, "Solis' visor can detect Nomad's airjabs.")
solis.addCounterNode(r6operators.brava, counterType.hard, "Solis' visor can detect and track Brava's krudge drone.")


export default solis