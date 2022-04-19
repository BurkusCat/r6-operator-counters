'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let finka = new Operator(r6operators.finka, operatorId.finka, "Operation Chimera");

finka.addCounterNode(operatorId.ela, counterType.soft, "Finka's Adrenal Surge cleanses the concussion effect from Ela's Grzmot mines.");
finka.addCounterNode(operatorId.caviera, counterType.soft, "Finka can use her Adrenal Surge to revive a downed ally preventing an interrogation from Caveira. This ally cannot be downed again.");
finka.addCounterNode(operatorId.echo, counterType.soft, "Finka's Adrenal Surge cleanses the disorientation effect from Echo's Yokai drone.");
finka.addCounterNode(operatorId.melusi, counterType.soft, "Finka's Adrenal Surge allow attackers to move through Melusi's Banshee.");

export default finka