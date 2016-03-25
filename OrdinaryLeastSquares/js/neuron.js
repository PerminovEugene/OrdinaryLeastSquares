/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.neuron = flight.component(
    function() {

    this.eventForSendResult = undefined;
    this.layer = undefined;
    this.id = undefined;


    this.startThink = function (e, data) {
       console.log('me thinked on layer ' + this.layer);
    };

    this.teachSelf = function (e, data) {
        console.log('me teached on layer ' + this.layer);
    };

    return this.after('initialize', function() {
        debugger
        this.layer = this.$node.data('layer');
        this.id = this.$node.data('id');
        var nextLayer = this.layer + 1;

        var eventForInputResult =  'to-' + this.layer;
        this.eventForSendResult = 'to-' + nextLayer;
        var eventForTeachSelf = 'teach-' + this.layer;

        this.on(document, eventForInputResult, function() {
            this.startThink();
        });
        this.on(document, eventForTeachSelf, function() {
            this.teachSelf();
        });
//        console.log('neuron ' + this.layer + this.id + " there!")

    });
});
