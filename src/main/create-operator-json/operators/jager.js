'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let jager = new Operator(r6operators.jager, operatorId.jager, "N/A");

jager.addCounterNode(operatorId.thatcher, counterType.hard, "Jäger's ADS can intercept Thatcher's EMP grenades.");
jager.addCounterNode(operatorId.ying, counterType.hard, "Jäger's ADS can intercept Ying's Candela grenades or the Flash Charges.");
jager.addCounterNode(operatorId.zofia, counterType.hard, "Jäger's ADS can intercept Zofia's Impact Grenades and Concussion Grenades.");
jager.addCounterNode(operatorId.nomad, counterType.soft, "Jäger's ADS can intercept Nomad's Airjabs.");
jager.addCounterNode(operatorId.glaz, counterType.minor, "Jäger's ADS can intercept smoke grenades. Smoke grenades are a key part of Glaz's kit.");
jager.addCounterNode(operatorId.ash, counterType.minor, "Jäger's ADS can intercept Ash's Breaching Rounds.");
jager.addCounterNode(operatorId.fuze, counterType.soft, "Jäger's ADS can intercept Fuze's Cluster Charges. Fuze gets four charges each with five sub-grenades (20 total) and Jäger's ADS can block two projectiles each (6 total). This means ADS is only partially effective against a Fuze attack.");
jager.addCounterNode(operatorId.kali, counterType.soft, "Jäger's ADS can intercept Kali's Explosive Lances.");
jager.addCounterNode(operatorId.zero, counterType.hard, "Jäger's ADS can intercept Zero's Argus cameras.");
jager.addCounterNode(operatorId.sens, counterType.hard, "Jäger's ADS can intercept Sens' ROU's.");
jager.addCounterNode(operatorId.grim, counterType.hard, "Jäger's ADS can intercept Grim's Hive Canisters.");

export default jager
