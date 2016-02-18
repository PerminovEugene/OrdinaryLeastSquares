'use strict';

window.OrdinaryLeastSquaresComponent = flight.component(
    window.OLSDataMixin,
    window.OLSAlgorithmMixin,
    function() {

    this.pointsData = {};
    this.plotConf;

    this.params = {
        "xmin": -2,
        "xmax": 2,
        "ymin": -2,
        "ymax": 2,
        "xticks": 10,
        "yticks": 10,
        "XtickDecimal": 2,
        "YtickDecimal": 2
    };

    this.getMinX = function () {
        return this.params["xmin"]
    };

    this.getMaxX = function () {
        return this.params["xmax"]
    };

    this.updateFlotConfig = function () {
        this.plotConf = {
            xaxis: {
                ticks: this.params["xticks"],
                min: this.params["xmin"],
                max: this.params["xmax"],
                tickDecimals: this.params["XtickDecimal"]
            },
            yaxis: {
                ticks: this.params["yticks"],
                min: this.params["ymin"],
                max: this.params["ymax"],
                tickDecimals: this.params["YtickDecimal"]
            }
        };

    };

    this.zoomTick = 0.5;
    this.zoomMax = 30;
    this.zoomMin = 1;
    this.addZoom = function () {
        if (this.params["xmax"] < this.zoomMax) {
            this.params["xmin"] -= this.zoomTick;
            this.params["xmax"] += this.zoomTick;
            this.params["ymin"] -= this.zoomTick;
            this.params["ymax"] += this.zoomTick;
        }
    };

    this.reduceZoom = function() {
        if (this.params["xmax"] > this.zoomMin) {
            this.params["xmin"] += this.zoomTick;
            this.params["xmax"] -= this.zoomTick;
            this.params["ymin"] += this.zoomTick;
            this.params["ymax"] -= this.zoomTick;
        }
    };

    this.redrawGraphic = function () {
        this.updateFlotConfig();
        $.plot($("#placeholder"), this.pointsData, this.plotConf );
    };

//  MOUSE EVENTS

    this.onWheel = function (e) {
        e = e || window.event;
        if (e.deltaY > 0) {
            this.addZoom()
        } else if (e.deltaY < 0) {
            this.reduceZoom();
        }
        this.redrawGraphic();
    };

    return this.after('initialize', function() {
       this.on('wheel', function() {
          this.onWheel();
       });
       this.on('redraw-graph', function() {
           this.redrawGraphic();
       });
    });
});

OrdinaryLeastSquaresComponent.attachTo('body');