'use strict';

window.OrdinaryLeastSquaresComponent = flight.component(function() {

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

        var d1 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25) {
            d1.push([i, Math.sin(i)]);
        }

        var d2 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25) {
            d2.push([i, Math.cos(i)]);
        }

        var d3 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.1) {
            d3.push([i, Math.tan(i)]);
        }
        this.pointsData = [
            { label: "sin(x)", data: d1 },
            { label: "cos(x)", data: d2 },
            { label: "tan(x)", data: d3 }
        ];

        // выводим график
        $.plot($("#placeholder"), this.pointsData, this.plotConf);
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
       return this.redrawGraphic();
    });
});

OrdinaryLeastSquaresComponent.attachTo('body');