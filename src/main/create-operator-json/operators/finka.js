'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let finka = new Operator(r6operators.finka, operatorId.finka, "Operation Chimera");

finka.addCounterNode(operatorId.ela, counterType.soft, "Finka's Adrenal Surge can cleanse the concussion effect from Ela's Grzmot mines.");
finka.addCounterNode(operatorId.caviera, counterType.soft, "Finka's Adrenal Surge can revive a downed ally, preventing an interrogation from Caveira, as this ally cannot be downed again.");
finka.addCounterNode(operatorId.echo, counterType.soft, "Finka's Adrenal Surge can cleanse the disorientation effect from Echo's Yokai drone.");
finka.addCounterNode(operatorId.melusi, counterType.soft, "Finka's Adrenal Surge can allow attackers to move through Melusi's Banshee without being slowed down.");
finka.addCounterNode(operatorId.fenrir, counterType.soft, "Finka's Adrenal Surge can allow attackers to see further through Fenrir's gas.");

export default finka
