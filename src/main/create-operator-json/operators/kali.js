'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let kali = new Operator(r6operators.kali, operatorId.kali, "Operation Shifting Tides");

kali.addCounterNode(operatorId.goyo, counterType.hard, 'Kali can destroy Goyos shields from the other side.');
kali.addCounterNode(operatorId.bandit, counterType.hard, 'Kali can destroy Bandits batteries.');
kali.addCounterNode(operatorId.mute, counterType.hard, 'Kali can destroy Mutes jammers.');
kali.addCounterNode(operatorId.maestro, counterType.hard, 'Kali can destroy Maestros camera.');
kali.addCounterNode(operatorId.castle, counterType.hard, 'Kali can Castle doors and windows.');
kali.addCounterNode(operatorId.clash, counterType.hard, 'Kali can stagger Clash Shield, Clash needs coordination to bring down');

export default kali 