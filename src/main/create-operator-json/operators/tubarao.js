'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let tubarao = new Operator(r6operators.tubarao, operatorId.tubarao, "Operation Deep Freeze");


tubarao.addCounterNode(r6operators.thermite, counterType.hard, "Tubarao's Zoto Cannister can stop Thermite's Exothermic Charge from triggering.")
tubarao.addCounterNode(r6operators.hibana, counterType.hard, "Tubarao's Zoto Cannister can stop Hibana's X-KARIOS pellets from triggering.")
tubarao.addCounterNode(r6operators.ace, counterType.hard, "Tubarao's Zoto Cannister can stop Ace's SELMA Breaching Device from triggering.")
tubarao.addCounterNode(r6operators.ram, counterType.hard, "Tubarao's Zoto Cannister can stop Ram's BU-GI from moving.")

export default tubarao