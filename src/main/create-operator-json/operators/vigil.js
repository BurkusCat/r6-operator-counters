'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let vigil = new Operator(r6operators.vigil, operatorId.vigil, "Operation White Noise");

vigil.addCounterNode(operatorId.dokkaebi, counterType.soft,  "Vigil's ERC-7 allows him to remove himself from cameras hacked by Dokkaebi.");
vigil.addCounterNode(operatorId.blackbeard, counterType.minor, "Vigil's BOSG.12.2 shotgun can destroy Blackbeard's Rifle-Shield in a single shot.");
vigil.addCounterNode(operatorId.twitch, counterType.minor,  "Vigil's ERC-7 allows him to remove himself from Twitch's Drone camera.");
vigil.addCounterNode(operatorId.lion, counterType.hard, "Vigil cannot be detected by Lion's EE-ONE-D drone scan when his ER7-C gadget is active.");

export default vigil