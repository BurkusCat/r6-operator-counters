'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

// Need to control name
const RecruitInfo = {
    name: 'Recruit',
    role: 'Recruit',
    unit: 'Recruit',
}

let recruit = new Operator(RecruitInfo, operatorId.recruit, "N/A");

export default recruit