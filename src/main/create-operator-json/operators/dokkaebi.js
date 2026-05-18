'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let dokkaebi = new Operator(r6operators.dokkaebi, operatorId.dokkaebi, "Operation White Noise/System Override");

dokkaebi.addCounterNode(operatorId.maestro, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Maestro's phone, cutting off his access to his Evil Eyes. She can also temporarily hack into the Evil Eye camera.");
dokkaebi.addCounterNode(operatorId.echo, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Echo's phone, cutting off his access to his Yokai drones. She can also temporarily hack into the Yokaicamera.");
dokkaebi.addCounterNode(operatorId.valkyrie, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Valkyrie's phone,cutting off her access to her Black Eye Cams. She can also temporarily hack into the Black Eye camera.");
dokkaebi.addCounterNode(operatorId.mozzie, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Mozzie's phone, cutting off his access to his hacked drones. She can also temporarily hack into the drones to regain the camera feed.");
dokkaebi.addCounterNode(operatorId.caviera, counterType.minor, "Dokkaebi can use her Jegeo Payload to ring Caveria's phone. This will reveal Caveria's position when roaming even if Silent Step is active.");
dokkaebi.addCounterNode(operatorId.skopos, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Skopos's phone. This will prevent Skopos from switching to her idle shell.");
dokkaebi.addCounterNode(operatorId.fenrir, counterType.hard, "Dokkaebi can use her Jegeo Payload to blow up Fenrir's phone. This will prevent Fenrir from activating or deactivating his Dread Mines.");


export default dokkaebi
