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
            this.weight = Math.random() - 0.5;
        };


        this.startThink = function (data) {

            var y = data['ySignal'];
            this.summ = y * globalWeights1[0][this.id];
            this.summ += this.weight;
            y = this.useActivateFunction(this.summ);
            var newData = {};
            newData['ySignal'] = y;
            newData['from'] = this.id;
            this.summ = 0;
//            console.log('think-hidden-neuro');
            data = null
            $('body').trigger(this.eventForSendResult, newData);

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
            this.previosLayerValues[data["from"]] = y;
            this.summ = y * globalWeights1[0][this.id];
            this.signalsCounter++;
//            console.log('hidden signals '+ this.signalsCounter + ' in ' + this.id)
            if (this.signalsCounter == enterNeuronsOnLayer) {
                this.summ += this.weight;
                y = this.useActivateFunction(this.summ);
                var newData = {};
                newData['ySignal'] = y;
                newData['xSourceCoordinate'] = data['xSourceCoordinate'];
                newData['ySourceCoordinate'] = data['ySourceCoordinate'];
                newData['from'] = this.id;
                this.signalsCounter = 0;
                $(document).trigger(this.eventForSendTeach, newData);
            }
        };

        this.errorsCounter = 0;
        this.errorsSumm = 0;
        this.deltaWeightJK = {};
        this.startBackForwardTeach = function (data) {
            this.errorsCounter += 1;
            this.errorsSumm += data['sigmaError'] * globalWeights1[0][this.id];
            if (this.errorsCounter == 1) {
                var error = this.errorsSumm * this.useActivateFunctionForBackForward(this.summ);

                this.errorsCounter = 0;

                for (var i = 0; i < enterNeuronsOnLayer; i++ ) {
                    this.deltaWeightJK[i] = speedOfLearning * error * this.previosLayerValues[i];
                    globalWeights1[0][this.id] += this.deltaWeightJK[i];
                }
                this.weight = speedOfLearning * error;
                this.summ = 0;
                this.errorsCounter = 0;
                this.errorsSumm = 0;
                this.previosLayerValues = {}
                this.deltaWeightJK = {};
                $(document).trigger('change-weights-on-exit-layer', {'from': this.id});
            }
        };


        return this.after('initialize', function() {
            this.layer = parseFloat(this.$node.data('layer'));
            this.id = parseFloat(this.$node.data('id'));
            var nextLayer = this.layer + 1;

            var eventForInputResult =  'to-' + this.layer;
            var eventForInputResultTeach =  'to-' + this.layer + "-teach";
            this.eventForSendResult = 'to-' + nextLayer;
            this.eventForSendTeach = 'to-' + nextLayer + "-teach";
            var eventForTeachSelf = 'teach-' + this.layer;

            var eventFromBackForward = 'to-' + this.layer + '-back-forward';

            this.on(document, eventFromBackForward, function(e, data) {
                this.startBackForwardTeach(data);
            });

            this.on(document, eventForInputResult, function(e, data) {
                this.startThink(data);
            });


            this.on(document, eventForInputResultTeach, function(e, data) {
                this.teachSelf(data);
            });
            console.log('hidden neuron ' + this.layer + ' ' + this.id + " there!")
            this.initWeight();
        });
    });
