'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let wamai = new Operator(r6operators.wamai, operatorId.wamai, "Operation Shifting Tides");

wamai.addCounterNode(operatorId.thatcher, counterType.hard, "Wamai's MAG-NET System can pull and destroy Thatcher's EMP Grenades.");
wamai.addCounterNode(operatorId.ash, counterType.hard, "Wamai's MAG-NET System can pull and destroy Ash's Breaching Charge.");
wamai.addCounterNode(operatorId.fuze, counterType.soft, "Wamai's MAG-NET System can pull and destroy Fuze's Cluster Charges.");
wamai.addCounterNode(operatorId.capitao, counterType.hard, "Wamai's MAG-NET System can pull and destroy Capitão's Smoke and Fire Bolts.");
wamai.addCounterNode(operatorId.ying, counterType.hard, "Wamai's MAG-NET System can pull and destroy Ying's Cadelas.");
wamai.addCounterNode(operatorId.nomad, counterType.hard, "Wamai's MAG-NET System can pull and destroy Nomad's Airjabs.");
wamai.addCounterNode(operatorId.zofia, counterType.hard, "Wamai's MAG-NET System can pull and destroy Zofia's Concussion and Impact Grenades.");
wamai.addCounterNode(operatorId.gridlock, counterType.minor, "Wamai's MAG-NET System can pull Gridlock's Trax Stinger, which then drop to the ground and release.");
wamai.addCounterNode(operatorId.kali, counterType.hard, "Wamai's MAG-NET System can pull and destroy Kali's Explosion Lances.");
wamai.addCounterNode(operatorId.zero, counterType.hard, "Wamai's MAG-NET System can pull and destroy Zero's Argus cameras.");
wamai.addCounterNode(operatorId.sens, counterType.soft, "Wamai's MAG-NET System can pull Sens' ROU, which then drop to the ground and release in a random direction.");
wamai.addCounterNode(operatorId.grim, counterType.soft, "Wamai's MAG-NET System can pull Grim's Hive Canister, which then drop to the ground and release.");

export default wamai
