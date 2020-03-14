'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let wamai = new Operator(r6operators.wamai, operatorId.wamai, "Operation Shifting Tides");

wamai.addCounterNode(operatorId.thatcher, counterType.hard,  "Wamai pulls Thatcer EMPs");
wamai.addCounterNode(operatorId.ash, counterType.hard,  "Wamai pulls Ashs Breacing Charge");
wamai.addCounterNode(operatorId.fuze, counterType.hard,  "Wamai pulls Fuzes Cluster Charges");
wamai.addCounterNode(operatorId.capitao, counterType.hard,  "Wamai pulls Capitaos Smoke and Fire Bolts");
wamai.addCounterNode(operatorId.ying, counterType.hard,  "Wamai pulls Yings Cadelas");
wamai.addCounterNode(operatorId.nomad, counterType.hard,  "Wamai pulls Nomads Airjabs");
wamai.addCounterNode(operatorId.zofia, counterType.hard,  "Wamai pulls Zofias Concussion and Impact Grenades");
wamai.addCounterNode(operatorId.gridlock, counterType.minor,  "Wamai pulls Gridlocks Trax Stinger but will not destroy");
wamai.addCounterNode(operatorId.kali, counterType.hard,  "Wamai pulls Kalis LV Lances");
wamai.addCounterNode(operatorId.recruit, counterType.hard,  "Wamai pulls frags, smokes, and stuns");

export default wamai