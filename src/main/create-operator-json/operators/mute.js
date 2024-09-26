'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let mute = new Operator(r6operators.mute, operatorId.mute, "N/A");

mute.addCounterNode(operatorId.hibana, counterType.hard, "Mute's Signal Disruptor can stop Hibana's X-KARIOS pellets from triggering.");
mute.addCounterNode(operatorId.thermite, counterType.hard, "Mute's Signal Disruptor can stop Thermite's Exothermic Charge from triggering.");
mute.addCounterNode(operatorId.ace, counterType.hard, "Mute's Signal Disruptor can stop Ace's SELMA Breaching Device from triggering.");
mute.addCounterNode(operatorId.fuze, counterType.hard, "Mute's Signal Disruptor can stop Fuze's Cluster Charges from triggering.");
mute.addCounterNode(operatorId.twitch, counterType.hard, "If placed correctly, Mute's Signal Disruptor can disrupt Twitch's Drone.");
mute.addCounterNode(operatorId.dokkaebi, counterType.hard, "When standing within range of Mute's Signal Disruptor, a defender's phone will not ring when Dokkaebi activates her Logic Bomb. A ringing phone will stop if you step within range of a Signal Disruptor.");
mute.addCounterNode(operatorId.jackal, counterType.soft, "Mute's Signal Disruptor covers Jackal's Eyenox in static. This makes vision difficult and prevents Jackal from scanning Defender footprints.")
mute.addCounterNode(operatorId.lion, counterType.soft, "When standing within range of Mute's Signal Disruptor, a defender can freely move without being detected by Lion's EE-ONE-D drone.");
mute.addCounterNode(operatorId.blitz, counterType.soft, "When standing within range of Mute's Signal Disruptor, Blitz's Flash Shield will be disrupted.");
mute.addCounterNode(operatorId.iana, counterType.hard, "Mute's Signal Disruptor will neutralize Iana's hologram.");
mute.addCounterNode(operatorId.zero, counterType.hard, "Mute's Signal Disruptor will disable Zero's cameras until they are destroyed.");
mute.addCounterNode(operatorId.flores, counterType.hard, "Mute's Signal Disruptor can stop Flores' RCE-RATERO drone from working.")
mute.addCounterNode(operatorId.sens, counterType.hard, "Mute's Signal Disruptor can stop Sens' ROU from working.")
mute.addCounterNode(operatorId.grim, counterType.hard, "Mute's Signal Disruptor stops Grim's Hive from deploying their swarm and protects operators in the jammer's radius.")


export default mute