'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

// Need to control name
const RecruitInfo = {
    name: 'Recruit',
    role: 'Recruit',
    unit: 'Recruit',
}

let recruit = new Operator(RecruitInfo, operatorId.recruit, "N/A");

export default recruit