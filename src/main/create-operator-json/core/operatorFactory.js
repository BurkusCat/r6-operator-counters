'use strict';

/** 
 *  Base class used when adding new operators
*/
export default class Operator{

    #id;
    #label;
    #side;
    #organization;
    #operation;
    #counters;

    /**
     * Create a new operator object
     * 
     * @param {r6operators object} person 
     * @param {integer} id 
     * @param {string} operation 
     */
    constructor(person, id, operation) {
        this.#id = id;
        this.#label = person.name;
        this.#side = person.role;
        this.#organization = person.unit;
        this.#operation = operation;
        this.#counters =[]; // array to hold relationship objects for D3.js
    }

    /**
     * Add a new counter for the operator object
     * 
     * @param {integer} personCountered 
     * @param {string} counterType 
     * @param {string} counterDescription 
     */
    addCounterNode(personCountered, counterType, counterDescription){
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
     * used for by D3.js visualization graph
     * 
     * [{
     * type: int,
     * startNode: int,
     * endNode: int,
     * properties: {
     *  Description: string
     * }}]
     */
    getCounters() {
        return this.#counters;
    }

    /**
     * Return a relationship object in a
     * format for use by D3.js visualization graph
     */
    getInformation() {
        return {
            id: this.#id,
            labels: [this.#label],
            properties: {
                side: this.#side,
                organization: this.#organization,
                operation: this.#operation
            }
        }
    }

}