'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let wamai = new Operator(r6operators.wamai, operatorId.wamai, "Operation Shifting Tides");

wamai.addCounterNode(operatorId.thatcher, counterType.hard,  "Wamai's MAG-NET System pulls Thatcher EMP Grenades.");
wamai.addCounterNode(operatorId.ash, counterType.hard,  "Wamai's MAG-NET System pulls Ash's Breaching Charge.");
wamai.addCounterNode(operatorId.fuze, counterType.hard,  "Wamai's MAG-NET System pulls Fuze's Cluster Charges.");
wamai.addCounterNode(operatorId.capitao, counterType.hard,  "Wamai's MAG-NET System pulls Capitão's Smoke and Fire Bolts.");
wamai.addCounterNode(operatorId.ying, counterType.hard,  "Wamai's MAG-NET System pulls Ying's Cadelas.");
wamai.addCounterNode(operatorId.nomad, counterType.hard,  "Wamai's MAG-NET System pulls Nomad's Airjabs.");
wamai.addCounterNode(operatorId.zofia, counterType.hard,  "Wamai's MAG-NET System pulls Zofia's Concussion and Impact Grenades.");
wamai.addCounterNode(operatorId.gridlock, counterType.minor,  "Wamai's MAG-NET System pulls Gridlock's Trax Stinger but will not destroy it.");
wamai.addCounterNode(operatorId.kali, counterType.hard,  "Wamai's MAG-NET System pulls Kali's Explosion Lances.");
wamai.addCounterNode(operatorId.zero, counterType.hard, "Wamai's MAG-NET System will grab Zero's cameras out of the air and destroy them.");
wamai.addCounterNode(operatorId.sens, counterType.soft, "Wamai's MAG-NET System will grab Sens' ROU and release it in a different direction.");
wamai.addCounterNode(operatorId.grim, counterType.soft, "Wamai's MAG-NET System pulls Grim's Hive Cannister.");

export default wamai
