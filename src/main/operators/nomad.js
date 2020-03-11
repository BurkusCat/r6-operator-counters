'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let nomad = new Operator(r6operators.nomad, operatorId.nomad, "Operation Wind Bastion");

nomad.addCounterNode(operatorId.clash, counterType.hard, "Nomad's Airjab can be used to knock Clash to the ground leaving her extremely vulnerable.");

export default nomad