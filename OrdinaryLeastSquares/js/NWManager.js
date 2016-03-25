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
                window.neuron.attachTo("." + classForCurrentNeuron);
            }
        }
        this.firstStart = false;
    };

    return this.after('initialize', function() {
        this.on('generate-web', function() {
            this.generate();
        });
    });
};
