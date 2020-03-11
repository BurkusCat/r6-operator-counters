'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let bandit = new Operator(r6operators.bandit, operatorId.bandit, "N/A");
bandit.addCounterNode(operatorId.hibana, counterType.hard, "Bandit's Shock Wire can electrify reinforced walls. Hibana's X-KAIROS pellets will be instantly destroyed if they are on an electrified wall. Bandit can very easily 'trick' Hibana's pellets." )
bandit.addCounterNode(operatorId.thermite, counterType.hard, "Bandit's Shock Wire can electrify reinforced walls. Thermite's Exothermic Charge will be instantly destroyed if it is on an electrified wall. Bandit can easily 'trick' Thermite's charge." )
bandit.addCounterNode(operatorId.twitch, counterType.soft, "Bandit's Shock Wire can be used to electrify barbed wire which can kill a Twitch Drone that enters the wire. However, Shock Wire is still easily shot by a Twitch Drone.");
bandit.addCounterNode(operatorId.dokkaebi, counterType.minor, "If a defender's phone is dropped into barbed wire electrified by Bandit's Shock Wire, it is destroyed.");

export default bandit