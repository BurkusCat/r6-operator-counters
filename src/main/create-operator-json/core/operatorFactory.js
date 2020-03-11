'use strict';

export default class Operator{

    // must pass r6operator as first argumet
    constructor(person, id, operation) {
        this.id = id;
        this.label = person.name;
        this.side = person.role;
        this.organization = person.unit;
        this.operation = operation;
        this.counters =[];
    }

    addCounterNode(personCountered, counterType, counterDescription){
        this.counters.push({
            type: counterType,
            startNode: this.id,
            endNode: personCountered,
            properties: {
                Description: counterDescription
            }
        });
    }

    getCounters() {
        return this.counters;
    }

    getInformation() {
        return {
            id: this.id,
            labels: [this.label],
            properties: {
                side: this.side,
                organization: this.organization,
                operation: this.operation
            }
        }
    }

}