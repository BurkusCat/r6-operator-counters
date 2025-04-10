'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let vigil = new Operator(r6operators.vigil, operatorId.vigil, "Operation White Noise");

vigil.addCounterNode(operatorId.dokkaebi, counterType.minor, "Vigil's ERC-7 can make himself invisible to cameras hacked by Dokkaebi.");
vigil.addCounterNode(operatorId.twitch, counterType.minor, "Vigil's ERC-7 can make himself invisible to Twitch's Drone camera.");
vigil.addCounterNode(operatorId.lion, counterType.hard, "Vigil ERC-7 can make himself undetectable from Lion's EE-ONE-D drone scan.");
vigil.addCounterNode(operatorId.iana, counterType.minor, "Vigils ERC-7 can make himself invisible to Iana's Hologram.");
vigil.addCounterNode(operatorId.flores, counterType.minor, "Vigil's ERC-7 can make himself invisible to Flores' RCE-RATERO drone camera.");
vigil.addCounterNode(operatorId.deimos, counterType.hard, "Vigil's ERC-7 can make himself almost untrackable by Deimos' DeathMARK.");
vigil.addCounterNode(operatorId.grim, counterType.hard, "Vigil's ERC-7 prevents himself being pinged by Grim's Hive Swarms.");

export default vigil
