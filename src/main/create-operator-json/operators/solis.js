'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let solis = new Operator(r6operators.solis, operatorId.solis, "Operation Solar Raid");

solis.addCounterNode(operatorId.blitz, counterType.hard, "Solis' visor can detect Blitz's shield while being held and therefore his position.");
solis.addCounterNode(operatorId.jackal, counterType.hard, "Solis' visor can detect Jackel's goggles while active.");
solis.addCounterNode(operatorId.nomad, counterType.soft, "Solis' visor can detect Nomad's airjabs.");
solis.addCounterNode(operatorId.brava, counterType.hard, "Solis' visor can detect and track Brava's Kludge drone.");
solis.addCounterNode(operatorId.ying, counterType.minor, "Solis' visor can detect and track Ying's Candelas.");
solis.addCounterNode(operatorId.dokkaebi, counterType.minor, "Solis' visor can track Dokkaebi's position when she's deploying her Jegeo Payloads.");
solis.addCounterNode(operatorId.sens, counterType.minor, "Solis' visor can detect and track Sens's ROU projectors.");
solis.addCounterNode(operatorId.lion, counterType.minor, "Solis' visor can detect and track Lion when he's using his EE-ONE-D scan.");
solis.addCounterNode(operatorId.nokk, counterType.hard, "Solis' visor can track Nokk's position while her HEL Presence Reduction is active.");
solis.addCounterNode(operatorId.iq, counterType.minor, "Solis' visor can track IQ's position while her Electronics Detector is active.");
solis.addCounterNode(operatorId.zero, counterType.soft, "Solis' visor can track Zero's position while his Argus Launcher is active and can track his Argus cameras while they're active.");
solis.addCounterNode(operatorId.grim, counterType.minor, "Solis' visor can detect Grim's Kawan Hives.");
solis.addCounterNode(operatorId.finka, counterType.hard, "Solis' visor can track the location of all attackers while Finka's Adrenal Surge is active.");
solis.addCounterNode(operatorId.iana, counterType.hard, "Solis' visor can track the location of Iana's Gemini clone.")
solis.addCounterNode(operatorId.ace, counterType.soft, "Solis' visor can detect Ace's SELMA breachers.")
solis.addCounterNode(operatorId.thermite, counterType.soft, "Solis' visor can detect Thermite's Exothermic Charges.")
solis.addCounterNode(operatorId.hibana, counterType.soft, "Solis' visor can detect Hibana's X-Kairos Pellets.")
solis.addCounterNode(operatorId.flores, counterType.soft, "Solis' visor can detect and track the location of Flores's RCE-Ratero Charge.")
solis.addCounterNode(operatorId.deimos, counterType.minor, "Solis' visor can detect and track Deimos's position while he's activating his DeathMARK tracker.")

export default solis
