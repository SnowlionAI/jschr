

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    }/* else {
        root.CHRGen = root.CHRGen || {};
        root.CHRGen.Checks = factory();
    }*/
}(this, function () {
    'use strict';
    var version = "0.0.1";


    // some checks

    var isCHRExpression = function(expr) {
        return isMemberExpression(expr.left);
    }
    var isObjectExpression = function(e) {
        return e && e.type == 'ObjectExpression';
    }

    var isCallExpression = function(e) {
        return e && e.type == 'CallExpression';
    }
    var isExpressionStatement = function(e) {
        return e && e.type == 'ExpressionStatement';
    }
    var isBlockStatement = function(e) {
        return e && e.type == 'BlockStatement';
    }
    var isBinaryExpression = function(e) {
        return e && e.type == 'BinaryExpression';
    }
    var isBlockStatement = function(e) {
        return e && e.type == 'BlockStatement';
    }
    var isFunctionExpression = function(e) {
        return e && e.type == 'FunctionExpression';
    }
    var isMemberExpression = function(e) {
        return e && e.type == 'MemberExpression';
    }
    var isAssignment = function(n) {
        return isExpressionStatement(n) && n.expression.operator == '=';
    }
    var isExpressionStatement = function(n) {
        return n && n.type == 'ExpressionStatement';
    }



    /* export */
    var Checks = {
        isCHRExpression: isCHRExpression, 
        isObjectExpression: isObjectExpression, 
        isCallExpression: isCallExpression, 
        isExpressionStatement: isExpressionStatement, 
        isBlockStatement: isBlockStatement, 
        isBinaryExpression: isBinaryExpression, 
        isBlockStatement: isBlockStatement, 
        isFunctionExpression: isFunctionExpression, 
        isMemberExpression: isMemberExpression, 
        isAssignment: isAssignment, 
        VERSION: version
    };
    return Checks;
}));


