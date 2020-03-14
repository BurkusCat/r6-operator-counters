'use strict';

/** 
 * Base class,
 * use this to create new Operator class objects
*/
export default class Operator{

    #id; // unique operator integer, 
    #name; // operators name, 
    #side; // defending or attacking, 
    #organization; // SEALs, GIGN, etc, 
    #operation; // operation release title, N/A for core operators
    #counters; // an array of objects, used by D3.js for connecting operator nodes

    /** 
     * 
     * @param {object} person object with operator info, Use an object import of r6operatos node_module
     * @param {number} id represents unique operator id, Use operatorIdEnum.js to fill this out
     * @param {string} operation name of the operation operator was released on, N/A if one of the core 17 operators
     */
    constructor(person, id, operation) {
        if(!person || !id || !operation) {
            throw 'Constructor is missing a field'
        }
        if(typeof person !== 'object' || typeof id !== 'number' || typeof operation != 'string') {
            throw 'Constructor param is not using the correct data type, check comments'
        }
        
        this.#id = id; 
        this.#name = person.name;
        this.#side = person.role;
        this.#organization = person.unit;
        this.#operation = operation;
        this.#counters =[]; // array to hold relationship objects for D3.js
    }

    /**
     * Push counter onto private array, 
     * make sure current operator is beating personCountered
     * No value returned
     * 
     * @param {number} personCountered the id of the operator being countered, Use operatorIdEnum.js to fill this out
     * @param {string} counterType the type of counter eg Hard Counter, Use counterTypeEnum.js to fill this out
     * @param {string} counterDescription describe how current operator beats the person countered
     */
    addCounterNode(personCountered, counterType, counterDescription){
        if(!personCountered || !counterType || !counterDescription) {
            throw 'addCounterNode is missing a field'
        }
        if(typeof personCountered !== 'number' || typeof counterType !== 'string' || typeof counterDescription != 'string') {
            throw 'addCounterNode param is not using the correct data type, check comments'
        }

        this.#counters.push({
            type: counterType,
            startNode: this.#id,
            endNode: personCountered,
            properties: {
                Description: counterDescription
            }
        });
    }

    /**
     * Returns an array of relationship objects 
     * in a format that can be used by D3.js visualization graph
     */
    getCounters() {
        return this.#counters;
    }

    /**
     * Return an object in a format to be used for the D3.js nodes
     */
    getInformation() {
        return {
            id: this.#id,
            labels: [this.#name],
            properties: {
                side: this.#side,
                organization: this.#organization,
                operation: this.#operation
            }
        }
    }

}