'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let mute = new Operator(r6operators.mute, operatorId.mute, "N/A");

mute.addCounterNode(operatorId.hibana, counterType.hard, "Mute's Signal Disruptor can stop Hibana's X-KARIOS pellets from triggering.");
mute.addCounterNode(operatorId.thermite, counterType.hard, "Mute's Signal Disruptor can stop Thermite's Exothermic Charge from triggering.");
mute.addCounterNode(operatorId.fuze, counterType.hard, "Mute's Signal Disruptor can stop Fuze's Cluster Charges from triggering.");
mute.addCounterNode(operatorId.twitch, counterType.hard, "Mute's Signal Disruptor can disrupt Twitch's Drone.");
mute.addCounterNode(operatorId.dokkaebi, counterType.hard, "Mute's Signal Disruptor prevents defender's phones from ringing when Dokkaebi activates her Jegeo Payload. They have to be in range though.");
mute.addCounterNode(operatorId.lion, counterType.soft, "When standing within range of Mute's Signal Disruptor, Lion can't activate his EE-ONE-D scan. The drone can still detect moving defenders if it is already scanning.");
mute.addCounterNode(operatorId.iana, counterType.hard, "Mute's Signal Disruptor will neutralize Iana's hologram.");
mute.addCounterNode(operatorId.zero, counterType.hard, "Mute's Signal Disruptor will disable Zero's cameras until they are destroyed.");
mute.addCounterNode(operatorId.flores, counterType.hard, "Mute's Signal Disruptor can stop Flores' RCE-RATERO drone from working.");
mute.addCounterNode(operatorId.sens, counterType.hard, "Mute's Signal Disruptor can stop Sens' ROU from working.");
mute.addCounterNode(operatorId.ram, counterType.hard, "Mute's Signal Disruptor can stop Ram's BU-GI from activating.");
mute.addCounterNode(operatorId.deimos, counterType.hard, "Mute's Signal Disruptor can prevent defenders from getting tracked by Deimos' DeathMARK.");

export default mute
