/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.exitNeuron = flight.component(
    function() {

        this.eventForSendResult = undefined;
        this.eventForSendTeachIterationResult = undefined;
        this.eventForBackForward = undefined;
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
        this.teachIteration = 0;
        this.previosLayerValues = {};
        this.deltaWeightJK = {};
        this.teachSelf = function (data) {
            var y = data['ySignal'];
            if (this.previosLayerValues[this.teachIteration] === undefined) {
                this.previosLayerValues[this.teachIteration] = {}
            }
            this.previosLayerValues[this.teachIteration][data["from"]] = y;

            this.summ = y * globalWeights2[data["from"]][this.id];
            this.signalsCounter++;
            if (this.signalsCounter == neuronsOnLayer) {
                this.summ += this.weight;
                y = this.useActivateFunction(this.summ);

                var newData = {};
                newData['ySignal'] = y;
                newData['xSourceCoordinate'] = data['xSourceCoordinate'];
                newData['ySourceCoordinate'] = data['ySourceCoordinate'];
                newData['teachIteration'] = this.teachIteration;
                $(document).trigger(this.eventForSendTeachIterationResult, newData);

//                Back forward

                var sigmaError = (data['ySourceCoordinate'] - y) * this.useActivateFunctionForBackForward(this.summ);
                for (var i = 0; i < neuronsOnLayer; i++ ) {
                    this.deltaWeightJK[i] = speedOfLearning * sigmaError * this.previosLayerValues[this.teachIteration][i];
//                    globalWeights2[data["from"]][this.id] += deltaWeightJK;
                }
                this.weight = speedOfLearning * sigmaError;
                var backForwardData = {};
                backForwardData['xSourceCoordinate'] = data['xSourceCoordinate'];
                backForwardData['ySourceCoordinate'] = data['ySourceCoordinate'];
                backForwardData['sigmaError'] = sigmaError;
                backForwardData['from'] = this.id;
                backForwardData['teachIteration'] = this.teachIteration;

                $(document).trigger(this.eventForBackForward, backForwardData)
                this.teachIteration += 1;
            }
        };

        this.changeWeightsOnFinishTeachIteration = function() {
            for (var i = 0; i < neuronsOnLayer; i++ ) {
                console.log("was")
                globalWeights2[i][this.id] += this.deltaWeightJK[i];
            }
        };


        return this.after('initialize', function() {
            this.layer = this.$node.data('layer');
            this.id = this.$node.data('id');
            var nextLayer = this.layer + 1;
            var previousLevel = this.layer -1;

            var eventForInputResult =  'to-' + this.layer;
            var eventForInputResultTeach =  'to-' + this.layer + "-teach";
            this.eventForSendTeachIterationResult = 'teach-iteration-result';
            this.eventForBackForward = 'to-' + previousLevel + '-back-forward';
            this.eventForSendResult = 'process-result';

            var eventForTeachSelf = 'teach-' + this.layer;

            this.on(document, eventForInputResult, function() {
                this.startThink();
            });
            this.on(document, eventForInputResultTeach, function(e, data) {
                this.teachSelf(data);
            });
            this.on(document, eventForTeachSelf, function() {
                this.teachSelf();
            });

            this.on(document, 'change-weights-on-exit-layer', function() {
                this.changeWeightsOnFinishTeachIteration();
            });


            console.log('exit neuron ' + this.layer + ' ' + this.id + " there!")
            this.initWeight();
        });
    });
