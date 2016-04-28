/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.NWDataMixin = function() {
    this.defaultAttrs({
        startBtnSelector: '.js-start-nw',
        teachBtnSelector: '.js-teach-nw',
        pointsCounterInput: '#point-count',
        functionSelector: '#select-function',
        layersCounterSelector: '#layers-counter',
        neuronsAtLayerCounter: '#neurons-at-layer-counter',
//        degreeApproximatingFunctionSelector: '#degree_approximating_function',
//        algorithmFeatureSelector: '#select-algorithm-feature',
//        crossValidationBlock: '.js-cross-validation-part',
        showSourceFunctionCheckbox: '#show-source-function',
//        crossValidationGroupsSelector: '#cross-validation-groups',
        completeStandartAndCrossCheckbox: '#show-standart-function-resul'

//        maximumDegreeOnCrossValidationSelector: '#maximum_degree_approximating_function'
    });

    this.pointsCount = 10;
    this.layersCount = 1;
    this.neuronsAtLayerCount = 1;
//    this.degreeApproximatingFunction = 1;
//    this.maximumDegreeApproximatingFunction = 2;
//    this.olsAlgorithmFunction = "standart";
//    this.crossValidationGroups = 2;
//    this.MAXIMUM_FUNCTION_DEGREE = 9;

    this.cosFinder = function (x) {
        return Math.cos(2 * Math.PI * x);
    };

    this.sinFinder = function (x) {
        return x * Math.sin(2 * Math.PI * x);
    };

    this.polyFinder = function (x) {
        return (5 * x * x * x) + (x * x) + 5;
    };
    this.currentFunction = this.cosFinder;

    this.sourcePoints = [];

    this.generateSourcePoints = function() {
        this.sourcePoints = [];
        var i = 0;
        var min = this.getMinX();
        var max = this.getMaxX();
        while (i < this.pointsCount) {
            var pointX = Math.random() * (max - min) + min;
            var pointY = this.currentFunction(pointX) + ((Math.random() * 0.1) - 0.05);
            this.sourcePoints.push([pointX, pointY]);
            i++;
        }
    };

    this.sourceGraphicPoints = [];
    this.generateSourceFunctionGraphic = function() {
        this.sourceGraphicPoints = [];
        var i = this.getMinX();
        var max = this.getMaxX();
        var step = (max - i ) / 1000;
        while (i < max) {
            var pointY = this.currentFunction(i);
            this.sourceGraphicPoints.push([i, pointY]);
            i = i + step;
        }
    };


    this.componateAllPointsData = function() {
        this.pointsData = [];
        this.pointsData.push({ label: "Source points", data: this.sourcePoints, points: { show: true, radius: 2, lineWidth: 5, fill: false } });

        if (this.resultPoints.length > 0) {
            this.pointsData.push( { label: "Finded function", data: this.resultPoints, lines: { show: true, fill: false } });
        }
        if (this.select('showSourceFunctionCheckbox')[0].checked) {
            this.generateSourceFunctionGraphic();
            this.pointsData.push( { label: "Source function", data: this.sourceGraphicPoints, lines: { show: true, fill: false } } )
        }
    };
    this.generateNW = function() {
//        this.resultCrossValidationPoints = [];
        this.resultPoints = [];
        this.generateSourcePoints();
        var event = 'generate-web';
        this.trigger(event);
//        if (this.select('completeStandartAndCrossCheckbox')[0].checked) {
//            var event = 'start-algorithm-standart';
//            this.trigger(event);
//        }

        this.componateAllPointsData();
        this.trigger('redraw-graph');
    };

    this.getDataAboutNW = function() {
        this.pointsCount = parseFloat(this.select('pointsCounterInput').val());
//        this.degreeApproximatingFunction = parseInt(this.select('degreeApproximatingFunctionSelector').val());
//        this.maximumDegreeApproximatingFunction = parseInt(this.select('maximumDegreeOnCrossValidationSelector').val());

//        this.crossValidationGroups = parseFloat(this.select('crossValidationGroupsSelector').val());
        this.layersCount= parseFloat(this.select('layersCounterSelector').val());
        this.neuronsAtLayerCount = parseFloat(this.select('neuronsAtLayerCounter').val());
        neuronsOnLayer = this.neuronsAtLayerCount;
        var func = this.select('functionSelector').val();
        switch (func) {
            case 'cos':
            {
                this.currentFunction = this.cosFinder;
                break;
            }
            case 'polynomial':
            {
                this.currentFunction = this.polyFinder;
                break;
            }
            case 'sin':
            {
                this.currentFunction = this.sinFinder;
                break;
            }
            default:
            {
                this.currentFunction = this.cosFinder;
            }
        }
        this.generateNW();
    };

//    this.algorithmFeatrue = function () {
//        this.olsAlgorithmFunction = this.select('algorithmFeatureSglobalWeights[i][this.id]elector').val();
//        if (this.olsAlgorithmFunction == "cross-validation") {
//            this.select('crossValidationBlock').removeClass("hidden");
//            $('.js-maximum-degree').removeClass('hidden')
//        }
//        else {
//            this.select('crossValidationBlock').addClass("hidden");
//            $('.js-maximum-degree').addClass('hidden')
//        }
//    };

    return this.after('initialize', function() {
        this.on('click', {
            startBtnSelector: this.getDataAboutNW
        });

//        this.on('click', {
//            algorithmFeatureSelector: this.algorithmFeatrue
//        });
    });
};
