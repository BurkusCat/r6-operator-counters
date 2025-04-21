'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let twitch = new Operator(r6operators.twitch, operatorId.twitch, "N/A");

twitch.addCounterNode(operatorId.mira, counterType.hard, "Twitch's Drone can pop out Mira's Black Mirrors.");
twitch.addCounterNode(operatorId.bandit, counterType.hard, "Twitch's Drone can shoot Bandit's Shock Wires.");
twitch.addCounterNode(operatorId.mute, counterType.hard, "Twitch's Drone can shoot Mute's Signal Disruptor, but has to stay out of its range.");
twitch.addCounterNode(operatorId.kaid, counterType.hard, "Twitch's Drone can shoot Kaid's Electroclaws.");
twitch.addCounterNode(operatorId.alibi, counterType.hard, "Twitch's Drone can shoot Alibi's Prismas.");
twitch.addCounterNode(operatorId.echo, counterType.soft, "Twitch's Drone can shoot Echo's Drone.");
twitch.addCounterNode(operatorId.ela, counterType.soft, "Twitch's Drone can shoot Ela's Grzmot mines.");
twitch.addCounterNode(operatorId.jager, counterType.hard, "Twitch's Drone can shoot Jäger's ADS.");
twitch.addCounterNode(operatorId.kapkan, counterType.soft, "Twitch's Drone can shoot Kapkan's EDDs.");
twitch.addCounterNode(operatorId.lesion, counterType.soft, "Twitch's Drone can shoot Lesion's Gu mines.");
twitch.addCounterNode(operatorId.melusi, counterType.soft, "Twitch's Drone can shoot Melusi's Banshee, but only while it is open.");
twitch.addCounterNode(operatorId.thunderbird, counterType.hard, "Twitch's Drone can shoot Thunderbird's Kona Station.");
twitch.addCounterNode(operatorId.thorn, counterType.soft, "Twitch's Drone can shoot Thorn's Razorbloom shell.");
twitch.addCounterNode(operatorId.fenrir, counterType.soft, "Twitch's Drone can shoot Fenrir's Dread Mines.");
twitch.addCounterNode(operatorId.goyo, counterType.hard, "Twitch's Drone can shoot Goyo's Volcán Canister, to trigger the explosion from a safe distance.");
twitch.addCounterNode(operatorId.mozzie, counterType.hard, "Twitch's Drone can shoot Mozzie's Pests or the Attacker Drones captured by them.");

export default twitch
