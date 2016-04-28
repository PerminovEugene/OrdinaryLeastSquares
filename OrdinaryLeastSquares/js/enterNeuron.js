/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.enterNeuron = flight.component(
    function() {

    this.eventForSendResult = undefined;
    this.layer = undefined;
    this.id = undefined;
    this.weight = undefined;

    this.initWeight = function () {
        this.weight = Math.random() * -0.5;
    };


    this.startThink = function (e, data) {
       console.log('me thinked on layer ' + this.layer);
    };

    this.teachSelf = function (e, data) {
        console.log('me teached on layer ' + this.layer);
    };

    this.startTeach = function (data) {
        var toNextLayerData = {};
        if (data) {
            toNextLayerData["xSourceCoordinate"] = data['x'];
            toNextLayerData["ySourceCoordinate"] = data['y'];
            toNextLayerData["ySignal"] = data['x'];
            toNextLayerData["from"] = this.id;
            $(document).trigger(this.eventForSendResultTeach, toNextLayerData)
        }
    };

    return this.after('initialize', function() {
        this.layer = parseFloat(this.$node.data('layer'));
        this.id = parseFloat(this.$node.data('id'));
        var nextLayer = this.layer + 1;

        var eventForInputResult =  'to-' + this.layer;
        this.eventForSendResult = 'to-' + nextLayer;
        this.eventForSendResultTeach = 'to-' + nextLayer + "-teach";
        var eventForTeachSelf = 'teach-' + this.layer;

        this.on(document, eventForInputResult, function() {
            this.startThink();
        });
        this.on(document, eventForTeachSelf, function() {
            this.teachSelf();
        });
        this.on (document, 'start-teach', function(e, data) {
            this.startTeach(data);
        });
        console.log('enter neuron ' + this.layer + this.id + " there!")
        this.initWeight();
    });
});
