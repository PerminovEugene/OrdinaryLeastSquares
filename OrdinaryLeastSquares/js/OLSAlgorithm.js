/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.OLSAlgorithmMixin = function() {

    this.result = [];
    this.resultPoints = [];

    this.generateResultFunction = function () {
        this.resultPoints = [];
        var i = 0;
        var pointX = this.getMinX();
        var max = this.getMaxX();
        var step = (max -pointX) / 1000;
        while (pointX < max) {
            var pointY = 0;
            var j;
            for (j = 0; j < this.result.length; j++) {
                pointY += this.result[j] *  Math.pow(pointX, j)
            }

            this.resultPoints.push([pointX, pointY]);
            pointX += step;
        }
    };

    this.generateFreeCoefficient = function (A) {
        var basis = this.degreeApproximatingFunction;
        var B = [];
        for (i = 0; i < basis; i++)
        {
            B.push(0);
        }


        var i = 0, j = 0;
        for (i = 0; i < basis; i++) {
            B[i] = A[i][A[i].length - 1];
        }
        var m, k = 1;
        for (k = 1; k < A.length; k++) {
            for (j = k; j < A.length; j++) {
                m = A[j][k - 1] / A[k - 1][k - 1];
                for ( i = 0; i < A[j].length; i++) {
                    A[j][i] = A[j][i] - m * A[k - 1][i];
                }
                B[j] = B[j] - m * B[k - 1];
            }
        }

        for (i= A.length-1; i>=0; i--) {
            for (j=i+1; j<A.length; j++) {
                B[i]-= A[i][j] * B[j];
            }
            B[i] = B[i] / A[i][i];
        }
        this.result = B;
        this.generateResultFunction();

    };

    this.generateMatrA = function () {
        var A = [], i = 0, j = 0;
        var basis = this.degreeApproximatingFunction;
        for (i = 0; i < basis; i++)
        {
            A.push([]);
            for (j = 0; j < basis + 1; j++)
            {
                A[i][j] = 0;
            }
        }

        for (i = 0; i < basis; i++)
        {
            for (j = 0; j < basis; j++)
            {
                var sumA = 0, sumB = 0, k = 0;
                for (k = 0; k < this.sourcePoints.length / 2; k++)
                {
                    sumA += Math.pow(this.sourcePoints[k][0], i) * Math.pow(this.sourcePoints[k][0], j);
                    sumB += this.sourcePoints[k][1] * Math.pow(this.sourcePoints[k][0], i);
                }
                A[i][j] = sumA;
                A[i][basis] = sumB;
            }
        }
        return A
    };

    this.startAlgorithm = function () {
        var A = this.generateMatrA();
        this.generateFreeCoefficient(A);
    };

    this.startWithCrossValidation = function () {
        debugger
        var A = this.generateMatrA();
        this.generateFreeCoefficient(A);
    };

    return this.after('initialize', function() {
        this.on('start-algorithm-standart', function() {
            this.startAlgorithm();
        });
        this.on('start-algorithm-cross-validation', function() {
            this.startWithCrossValidation();
        });
    });
};
