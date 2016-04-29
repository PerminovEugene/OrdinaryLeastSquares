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
                if ((i === 0 ) && (j == 0)) {
                    window.enterNeuron.attachTo("." + classForCurrentNeuron);
                } else if (i === this.layersCount - 1 ) {
                    window.exitNeuron.attachTo("." + classForCurrentNeuron);
                } else {
                    if (i !== 0)
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
        $(document).trigger('start-teach1', data);
    };

    this.pointsCounter = 0;
    this.resultsPoints = [];
    this.teach = function () {
        this.sendNextPointForTeach(this.sourcePoints[this.pointsCounter]);
    };


    this.processNextPoint = function() {
        $(document).trigger('to-0', {'x':this.step})
    };

    this.approximationPoints = [];
    this.step = 0;
    this.showFunction = function() {
        if (this.step < this.getMaxX()) {
            this.step += (this.getMaxX() - this.getMinX()) / 100;
            this.processNextPoint()
        }
        else {
            debugger
        }
    };


    this.teachIterationCounter = 0;
    this.teachIterationArrays = [];
    this.saveTeachIterationResult = function(data) {
    };

    return this.after('initialize', function() {
        this.on('generate-web', function() {
            this.generate();
        });

        this.on(document, 'teach-iteration-result', function(e, data) {
            this.saveTeachIterationResult(data);
        });


        this.on('new-teach-iteration', function() {
            this.teach();
        });
        this.t = 0;
        this.on('start-teach', function() {
            // Инициализируем веса тут, потому что в нейронах их хранить не ок
            globalWeights1.push([]);
            neuronsOnLayer = this.neuronsAtLayerCount;
            for (var i=0; i< neuronsOnLayer; i++) {
//                globalWeights1.push([]);
                globalWeights2.push([]);
//                for (var j=0; j<neuronsOnLayer; j++) {
//                    globalWeights1[i][j] = Math.random()-0.5
                globalWeights2[i][0] = Math.random()-0.5;
//                }
                globalWeights1[0][i] = Math.random()-0.5;
            }

            this.teach();
        });

        this.on('show-function', function() {
            this.step = this.getMinX();
            this.showFunction();
        });


        this.on(document, 'finish-teach-iteration-on-point', function(e, data) {
            if (this.pointsCounter === this.sourcePoints.length - 1) {
                var summ = 0;
                for (var i = 0; i < this.resultsPoints.length; i ++) {
                    summ += Math.pow( (this.sourcePoints[i][1] - this.resultsPoints[i]), 2)
                }
                var err = Math.sqrt(summ / (this.resultsPoints.length - 1));
                console.log(err)
                this.t += 1
//                if (this.t == 4) {debugger}
                if (err < 1) {
                    this.trigger('show-function')
                } else {
                    this.pointsCounter = 0;
                    this.resultsPoints = [];
                    this.trigger('new-teach-iteration');
                }


            } else {
                this.resultsPoints.push(data['result']);
                this.pointsCounter += 1;
                this.sendNextPointForTeach(this.sourcePoints[this.pointsCounter]);
            }
        });


        this.on('body', 'process-result', function(e, data) {
            this.approximationPoints.push([this.step, data['ySignal']])
            this.showFunction();
        });




    });

};

var nwWorked = false;
var neuronsOnLayer = 0;
var enterNeuronsOnLayer = 1;
var globalWeights1 = [];
var globalWeights2 = [];
var speedOfLearning = 1;
