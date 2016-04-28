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
            var k = this.neuronsAtLayerCount;
            if (i === this.layersCount - 1) {
                k = 1
            }
            for(var j=0; j < k; j++) {
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

    this.sendNextPointForTeach = function(point) {
        var data = {};
        data["x"] = point[0];
        data["y"] = point[1];
        $(document).trigger('start-teach', data);
    };

    this.pointsCounter = 0;
    this.finishEventsFromNeurons = 0;
    this.resultsPoints = [];
    this.teach = function () {
        var data = {};

        this.on(document, 'finish-teach-iteration-on-point', function(e, data) {
            if (this.pointsCounter === this.sourcePoints.length - 1) {
                var summ = 0;
                for (var i = 0; i < this.resultsPoints.length; i ++) {
                    summ += Math.pow( (this.sourcePoints[i][1] - this.resultsPoints[i]), 2)
                }
                var err = Math.sqrt(summ / (this.resultsPoints.length - 1));
                console.log(e                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       rr);
                if (err < 0.03) {
                    debugger
                } else {
                    this.pointsCounter = 0;
                    this.resultsPoints = []
                    this.teach();
                }


            } else {
//                if (this.finishEventsFromNeurons === this.neuronsAtLayerCount) {
                this.resultsPoints.push(data['result']);
                this.pointsCounter += 1;
                this.sendNextPointForTeach(this.sourcePoints[this.pointsCounter]);
//                this.finishEventsFromNeurons = 0;
//                } else {
//                    this.finishEventsFromNeurons += 1;
//                }
            }
        });
        this.sendNextPointForTeach(this.sourcePoints[this.pointsCounter]);


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
