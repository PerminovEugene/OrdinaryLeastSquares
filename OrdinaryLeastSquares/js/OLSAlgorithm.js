/*
 Mixin for generate data for OLS algorithm.
 */
'use strict';
window.OLSAlgorithmMixin = function() {

    this.result = [];
    this.resultPoints = [];
    this.resultCrossValidationPoints = [];

    this.generateResultFunction = function () {
        var resultPoints = [];
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

            resultPoints.push([pointX, pointY]);
            pointX += step;
        }
        return resultPoints;
    };

    this.gaussSystemSolution = function (A) {
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
        return B;

    };

    this.generateMatrA = function (sourcePoints) {
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
                for (k = 0; k < sourcePoints.length / 2; k++)
                {
                    sumA += Math.pow(sourcePoints[k][0], i) * Math.pow(sourcePoints[k][0], j);
                    sumB += sourcePoints[k][1] * Math.pow(sourcePoints[k][0], i);
                }
                A[i][j] = sumA;
                A[i][basis] = sumB;
            }
        }
        return A
    };

    this.startAlgorithm = function () {
        var A = this.generateMatrA(this.sourcePoints);
        this.result = this.gaussSystemSolution(A);
        this.resultPoints = this.generateResultFunction();
    };

    this.startWithCrossValidation = function () {
        var trainingPoints = [];
        var controlPoints = [];
        var controlCoefficients = [];
        var pointsInGroup = this.sourcePoints.length / this.crossValidationGroups;
        var groupNumber = 0;
        controlCoefficients = [];
        while (groupNumber < this.crossValidationGroups) {
            trainingPoints = [];
            controlPoints = [];
//            console.log(groupNumber + " итерация кросс валидации");

            var point = 0;
            while (point < this.sourcePoints.length) {
                if ((point > (groupNumber * pointsInGroup)-1) && (point < (groupNumber + 1) * pointsInGroup)) {
//                    console.log(point + " точка сейчас в контрольной группе");
                    controlPoints.push(this.sourcePoints[point]);
                } else {
//                    console.log(point + " точка сейчас в тренировочной группе");
                    trainingPoints.push(this.sourcePoints[point]);
                }
                point++
            }
            var A = this.generateMatrA(trainingPoints);
            controlCoefficients.push(this.gaussSystemSolution(A));
            groupNumber++
        }
        var t = 0, l= 0;
        var balancedCoefficient = [];
        while (l < this.degreeApproximatingFunction) {
            balancedCoefficient.push(0);
            t = 0;
            while (t < controlCoefficients.length) {
//                debugger
                balancedCoefficient[l] += controlCoefficients[t][l];
                t++;
            }
            balancedCoefficient[l] = balancedCoefficient[l] / controlCoefficients.length;
            l++;
        }
        this.result = balancedCoefficient;
        this.resultCrossValidationPoints = this.generateResultFunction();
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
