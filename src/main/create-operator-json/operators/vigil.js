'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";
let vigil = new Operator(r6operators.vigil, operatorId.vigil, "Operation White Noise");

vigil.addCounterNode(operatorId.dokkaebi, counterType.soft,  "Vigil's ERC-7 allows him to remove himself from cameras hacked by Dokkaebi.");
vigil.addCounterNode(operatorId.blackbeard, counterType.minor, "Vigil's BOSG.12.2 shotgun can destroy Blackbeard's Rifle-Shield in a single shot.");
vigil.addCounterNode(operatorId.twitch, counterType.minor,  "Vigil's ERC-7 allows him to remove himself from Twitch's Drone camera.");
vigil.addCounterNode(operatorId.lion, counterType.hard, "Vigil cannot be detected by Lion's EE-ONE-D drone scan when his ER7-C gadget is active.");
vigil.addCounterNode(operatorId.iana, counterType.minor, "Vigils ERC-7 makes him invisible from Iana's Hologram.");
vigil.addCounterNode(operatorId.flores, counterType.soft,  "Vigil's ERC-7 allows him to remove himself from Flores' RCE-RATERO drone camera.");
vigil.addCounterNode(operatorId.deimos, counterType.hard,  "Vigil's ERC-7 allows him to nullify Deimos' DeathMARK.");

export default vigil