'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let maestro = new Operator(r6operators.maestro, operatorId.maestro, "Operation Para Bellum");

maestro.addCounterNode(operatorId.iana, counterType.soft, "Maestro's Evil Eyes can destroy Iana's Hologram with its laser, and can detect its lack of heat signature.");
maestro.addCounterNode(operatorId.zero, counterType.soft, "Maestro's Evil Eye can destroy Zero's cameras.");
maestro.addCounterNode(operatorId.hibana, counterType.hard, "Maestro's Evil Eye can destroy Hibana's shock pellets with its laser.")
maestro.addCounterNode(operatorId.twitch, counterType.hard, "Maestro's Evil Eye can destroy Twitch's shock drones with its laser.")
maestro.addCounterNode(operatorId.glaz, counterType.minor, "Maestro's Evil Eye can detect Glaz through smoke, which Glaz relies on.")
maestro.addCounterNode(operatorId.maverick, counterType.soft, "Maestro's Evil Eye can shoot Maverick with its laser, making it difficult for him to blow torch holes.")
maestro.addCounterNode(operatorId.montagne, counterType.minor, "Maestro's Evil Eye can shoot Montagne from behind when he is pushing, causing him to turn around and potentially exposing him.")
maestro.addCounterNode(operatorId.blitz, counterType.minor, "Maestro's Evil Eye can shoot Blitz from behind when he is hard pushing, causing him to turn around and potentially exposing him.")
maestro.addCounterNode(operatorId.thermite, counterType.hard, "Maestro's Evil Eye can destroy Thermite's Exothermic Charges with its laser.")
maestro.addCounterNode(operatorId.ace, counterType.hard, "Maestro's Evil Eye can destroy Ace's SELMAs with its laser.")

export default maestro