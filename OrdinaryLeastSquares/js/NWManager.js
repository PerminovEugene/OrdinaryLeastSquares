/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.NWManagerMixin = function() {

    this.firstStart = true;

    this.generate = function () {
        var webSelector = $('.js-web');
        if (this.firstStart === false) {
            $('.js-layer').remove()
        }

        for(var i=0; i< this.layersCount; i++) {
            var layer = $('<div class="js-layer" data-id="' + i + '">');
            webSelector.append(layer);
            for(var j=0; j < this.neuronsAtLayerCount; j++) {
                var classForCurrentNeuron = "js-neuron-" + i + "-"+ j ;
                var neuronSelector = $('<div class="js-neuron '+ classForCurrentNeuron +'" data-id="' + j + '" data-layer="' + i + '">');
                layer.append(neuronSelector);
                if (i === 0) {
                    window.enterNeuron.attachTo("." + classForCurrentNeuron);
                } else if (i === this.layersCount - 1 ) {
                    window.exitNeuron.attachTo("." + classForCurrentNeuron);
                } else {
                    window.hiddenNeuron.attachTo("." + classForCurrentNeuron);
                }
            }
        }
        this.firstStart = false;


        var that = this;
        setTimeout(that.trigger('start-teach'), 500)


    };

    this.teach = function () {
        var data = {};
        for (var i=0; i < this.sourcePoints.length; i++) {
            data["x"] = this.sourcePoints[i][0];
            data["y"] = this.sourcePoints[i][1];
            $(document).trigger('start-teach', data);
        }


//        while (nwWorked == false) {
//            var data = {}
//            data["learningData"] = this.sourcePoints;
//            $(document).trigger('start-teach', data)
//        }
    };
    this.teachIterationCounter = 0;
    this.teachIterationArrays = [];
    this.saveTeachIterationResult = function(data) {
//        var iteration = parseFloat(data['teachIteration'], 10);
//        if (this.teachIterationArrays[iteration] === undefined) {
//            this.teachIterationArrays[iteration] = []
//        }
//        this.teachIterationArrays[iteration].push(data);
    };

    return this.after('initialize', function() {
        this.on('generate-web', function() {
            this.generate();
        });

        this.on(document, 'teach-iteration-result', function(e, data) {
            this.saveTeachIterationResult(data);
        });


        this.on('start-teach', function() {
            // Инициализируем веса тут, потому что в нейронах их хранить не ок
            neuronsOnLayer = this.neuronsAtLayerCount;
            for (var i=0; i< neuronsOnLayer; i++) {
                globalWeights1.push([]);
                globalWeights2.push([]);
                for (var j=0; j<neuronsOnLayer; j++) {
                    globalWeights1[i][j] = Math.random()-0.5
                    globalWeights2[i][j] = Math.random()-0.5
                }
            }

            this.teach();
        });



    });

};

var nwWorked = false;
var neuronsOnLayer = 0;

var globalWeights1 = [];
var globalWeights2 = [];
var speedOfLearning = 1;
