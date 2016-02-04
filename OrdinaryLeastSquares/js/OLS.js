/*
 Mixin for add popover with description to table
 */
'use strict';
window.OLSMixin = function() {
    this.defaultAttrs({
        startBtnSelector: '.js-start-ols',
        pointsCounterInput: '#point-count',
        functionSelector: '#select-function'
    });

    this.pointsCount = 10;

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
            var pointY = this.currentFunction(pointX);
            this.sourcePoints.push([pointX, pointY]);
            i++;
        }
    };


    this.componateAllPointsData = function() {
        this.pointsData = [
            { label: "Source points", data: this.sourcePoints },
        ];
    };
    this.startOLS = function() {
        this.generateSourcePoints();
        this.componateAllPointsData();
        this.trigger('redraw-graph');
    };

    this.getDataAboutOLS = function() {
       this.pointsCount = parseFloat(this.select('pointsCounterInput').val());
       var func = this.select('functionSelector').val();
       switch(func) {
           case 'cos': {
               this.currentFunction = this.cosFinder;
               break
           }
           case 'polynomial': {
               this.currentFunction = this.polyFinder;
               break
           }
           case ' sin': {
               this.currentFunction = this.sinFinder;
               break
           }
           default: {
               this.currentFunction = this.cosFinder;
           }
       }
       this.startOLS();
    };
    return this.after('initialize', function() {
        this.on('click', {
            startBtnSelector: this.getDataAboutOLS
        });
    });
};

// ---
// generated by coffee-script 1.9.2