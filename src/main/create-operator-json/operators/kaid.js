'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let kaid = new Operator(r6operators.kaid, operatorId.kaid, "Operation Wind Bastion");

kaid.addCounterNode(operatorId.thermite, counterType.hard, "Kaid's Electroclaws can electrify reinforced walls. Thermite's Exothermic Charge will be instantly destroyed if it is on an electrified wall. It is technically possibly for Kaid to 'trick' Thermite's charge if you are extremely fast.");
kaid.addCounterNode(operatorId.hibana, counterType.hard, "Kaid's Electroclaws can electrify reinforced walls. Hibana's X-KAIROS pellets will be instantly destroyed if they are on an electrified wall. Kaid can 'trick' Hibana's pellets.");
kaid.addCounterNode(operatorId.ace, counterType.hard, "Kaid's Electroclaws can electrify reinforced walls. Ace's SELMA Breaching Device will be instantly destroyed if it is on an electrified wall. Kaid can 'trick' Ace's SELMA.")
kaid.addCounterNode(operatorId.twitch, counterType.soft, "Kaid's Electroclaws can be used to electrify barbed wire which can kill a Twitch Drone that enters the wire. However, an Electroclaw can be easily shot by a Twitch Drone is improperly positioned.");
kaid.addCounterNode(operatorId.dokkaebi, counterType.minor, "If a defender's phone is dropped into barbed wire electrified by Kaid's Electroclaws, it is destroyed.")
kaid.addCounterNode(operatorId.iana, counterType.hard, "Kaid's Electroclaws can destroy Iana's Hologram when she comes in contact with something electrified by it.");
kaid.addCounterNode(operatorId.zero, counterType.hard, "Kaid's Electroclaws can electrify reinforced walls. Zero's cameras that are deployed on the same wall will be instantly destroyed.");

export default kaid
