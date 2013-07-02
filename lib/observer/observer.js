'use strict';

var util = require('util');
var events = require('events');

var instances = {};


//INSTANCE CONSTRUCTOR
var Observer = function (_name) {
    this.name = _name;

    if (!instances[_name]) {
        instances[_name] = this;
    } else {
        throw 'Observer with name \'' + _name + '\' already exists.';
    }
};


//PRIVATE METHODS

//init method if necessary
var initialize = function () {},

    get = function (name) {
        return instances[name];
    },

    create = function (name) {
        return new Observer(name);
    },
    //creates or returns an already created observer instance.
    load = function (name) {
        return get(name) || create(name);
    };



// extend the EventEmitter class using our Observer class
util.inherits(Observer, events.EventEmitter);

//initialize is currently a noop function
initialize();

//Public methods
module.exports = {
    load: load
};