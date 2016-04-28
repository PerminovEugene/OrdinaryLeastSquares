/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.hiddenNeuron = flight.component(
    function() {

        this.eventForSendResult = undefined;
        this.eventForSendTeach = undefined;
        this.layer = undefined;
        this.id = undefined;
        this.weight = undefined;

        this.initWeight = function () {
            this.weight = Math.random() * -0.5;
        };


        this.startThink = function (e, data) {
            console.log('me thinked on layer ' + this.layer);
        };

        this.useActivateFunction = function (arg) {
            var result = 1 / (1 + Math.exp(arg * (-1)));
            return result;
        };

        this.useActivateFunctionForBackForward = function (arg) {
            var result = this.useActivateFunction(arg) * (1 - this.useActivateFunction(arg));
            return result;
        };

        this.signalsCounter = 0;
        this.summ = 0;
        this.previosLayerValues = {};
        this.teachIteration = 0;

        this.teachSelf = function (data) {
            var y = data['ySignal'];

            if (this.previosLayerValues[this.teachIteration] === undefined) {
                this.previosLayerValues[this.teachIteration] = {}
            }
            this.previosLayerValues[this.teachIteration][data["from"]] = y;

            this.summ = y * globalWeights1[data["from"]][this.id];
            this.signalsCounter++;
            if (this.signalsCounter == neuronsOnLayer) {

                this.summ += this.weight;
                y = this.useActivateFunction(this.summ);
                var newData = {};
                newData['ySignal'] = y;
                newData['xSourceCoordinate'] = data['xSourceCoordinate'];
                newData['ySourceCoordinate'] = data['ySourceCoordinate'];
                newData['from'] = this.id;
                $(document).trigger(this.eventForSendTeach, newData);
                this.signalsCounter = 0;
                this.teachIteration += 1;
            }
        };

        this.errorsCounter = 0;
        this.errorsSumm = 0;
        this.deltaWeightJK = {};
        this.startBackForwardTeach = function (data) {
            this.errorsCounter += 1;
            this.errorsSumm += data['sigmaError'] * globalWeights1[this.id][data['from']];
            if (this.errorsCounter == neuronsOnLayer) {
                var error = this.errorsSumm * this.useActivateFunctionForBackForward(this.summ);

                this.errorsCounter = 0;

                for (var i = 0; i < neuronsOnLayer; i++ ) {
                    this.deltaWeightJK[i] = speedOfLearning * error * this.previosLayerValues[data["teachIteration"]][i];
                    globalWeights1[data["from"]][this.id] += this.deltaWeightJK[i];
                }
                this.weight = speedOfLearning * error;
                $(document).trigger('change-weights-on-exit-layer')

            }
        };

        this.startTeach = function (data) {
            debugger
        }


        return this.after('initialize', function() {
            this.layer = parseFloat(this.$node.data('layer'));
            this.id = parseFloat(this.$node.data('id'));
            var nextLayer = this.layer + 1;

            var eventForInputResult =  'to-' + this.layer;
            var eventForInputResultTeach =  'to-' + this.layer + "-teach";
            this.eventForSendResult = 'to-' + nextLayer;
            this.eventForSendTeach = 'to-' + nextLayer + "-teach";
            var eventForTeachSelf = 'teach-' + this.layer;

            var eventFromBackForward = 'to-' + this.layer + '-back-forward'

            this.on(document, eventFromBackForward, function(e, data) {
                this.startBackForwardTeach(data);
            });

            this.on(document, eventForInputResult, function() {
                this.startThink();
            });

            this.on(document, eventForInputResult, function(e, data) {
                this.startTeach(data);
            });

            this.on(document, eventForInputResultTeach, function(e, data) {
                this.teachSelf(data);
            });
            console.log('hidden neuron ' + this.layer + ' ' + this.id + " there!")
            this.initWeight();
        });
    });