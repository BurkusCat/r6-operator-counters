'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let glaz = new Operator(r6operators.glaz, operatorId.glaz, "N/A");

glaz.addCounterNode(operatorId.alibi, counterType.minor, "The Thermal Feedback System on Glaz's OTs-03 will not highlight Alibi's Prisma. This means Glaz is more likely to avoid shooting Alibi's Prisma.");
glaz.addCounterNode(operatorId.smoke, counterType.soft,  "The Thermal Feedback System on Glaz's OTs-03 can see through Smoke's Gas Grenades.");

export default glaz