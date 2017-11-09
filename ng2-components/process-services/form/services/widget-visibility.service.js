"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var Rx_1 = require("rxjs/Rx");
var WidgetVisibilityService = (function () {
    function WidgetVisibilityService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    WidgetVisibilityService.prototype.refreshVisibility = function (form) {
        var _this = this;
        if (form && form.tabs && form.tabs.length > 0) {
            form.tabs.map(function (tabModel) { return _this.refreshEntityVisibility(tabModel); });
        }
        if (form) {
            form.getFormFields().map(function (field) { return _this.refreshEntityVisibility(field); });
        }
    };
    WidgetVisibilityService.prototype.refreshEntityVisibility = function (element) {
        var visible = this.evaluateVisibility(element.form, element.visibilityCondition);
        element.isVisible = visible;
    };
    WidgetVisibilityService.prototype.evaluateVisibility = function (form, visibilityObj) {
        var isLeftFieldPresent = visibilityObj && (visibilityObj.leftFormFieldId || visibilityObj.leftRestResponseId);
        if (!isLeftFieldPresent || isLeftFieldPresent === 'null') {
            return true;
        }
        else {
            return this.isFieldVisible(form, visibilityObj);
        }
    };
    WidgetVisibilityService.prototype.isFieldVisible = function (form, visibilityObj) {
        var leftValue = this.getLeftValue(form, visibilityObj);
        var rightValue = this.getRightValue(form, visibilityObj);
        var actualResult = this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);
        if (visibilityObj.nextCondition) {
            return this.evaluateLogicalOperation(visibilityObj.nextConditionOperator, actualResult, this.isFieldVisible(form, visibilityObj.nextCondition));
        }
        else {
            return actualResult;
        }
    };
    WidgetVisibilityService.prototype.getLeftValue = function (form, visibilityObj) {
        var leftValue = '';
        if (visibilityObj.leftRestResponseId && visibilityObj.leftRestResponseId !== 'null') {
            leftValue = this.getVariableValue(form, visibilityObj.leftRestResponseId, this.processVarList);
        }
        else {
            leftValue = this.getFormValue(form, visibilityObj.leftFormFieldId);
            leftValue = leftValue ? leftValue : this.getVariableValue(form, visibilityObj.leftFormFieldId, this.processVarList);
        }
        return leftValue;
    };
    WidgetVisibilityService.prototype.getRightValue = function (form, visibilityObj) {
        var valueFound = '';
        if (visibilityObj.rightRestResponseId) {
            valueFound = this.getVariableValue(form, visibilityObj.rightRestResponseId, this.processVarList);
        }
        else if (visibilityObj.rightFormFieldId) {
            valueFound = this.getFormValue(form, visibilityObj.rightFormFieldId);
        }
        else {
            if (moment(visibilityObj.rightValue, 'YYYY-MM-DD', true).isValid()) {
                valueFound = visibilityObj.rightValue + 'T00:00:00.000Z';
            }
            else {
                valueFound = visibilityObj.rightValue;
            }
        }
        return valueFound;
    };
    WidgetVisibilityService.prototype.getFormValue = function (form, fieldId) {
        var value = this.getFieldValue(form.values, fieldId);
        if (!value) {
            value = this.searchValueInForm(form, fieldId);
        }
        return value;
    };
    WidgetVisibilityService.prototype.getFieldValue = function (valueList, fieldId) {
        var dropDownFilterByName, valueFound;
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            dropDownFilterByName = fieldId.substring(0, fieldId.length - 6);
            if (valueList[dropDownFilterByName]) {
                valueFound = valueList[dropDownFilterByName].name;
            }
        }
        else if (valueList[fieldId] && valueList[fieldId].id) {
            valueFound = valueList[fieldId].id;
        }
        else {
            valueFound = valueList[fieldId];
        }
        return valueFound;
    };
    WidgetVisibilityService.prototype.searchValueInForm = function (form, fieldId) {
        var _this = this;
        var fieldValue = '';
        form.getFormFields().forEach(function (formField) {
            if (_this.isSearchedField(formField, fieldId)) {
                fieldValue = _this.getObjectValue(formField);
                if (!fieldValue) {
                    if (formField.value && formField.value.id) {
                        fieldValue = formField.value.id;
                    }
                    else {
                        fieldValue = formField.value;
                    }
                }
            }
        });
        return fieldValue;
    };
    WidgetVisibilityService.prototype.getObjectValue = function (field) {
        var value = '';
        if (field.value && field.value.name) {
            value = field.value.name;
        }
        else if (field.options) {
            var option = field.options.find(function (opt) { return opt.id === field.value; });
            if (option) {
                value = option.name;
            }
            else {
                value = field.value;
            }
        }
        return value;
    };
    WidgetVisibilityService.prototype.isSearchedField = function (field, fieldToFind) {
        var formattedFieldName = this.removeLabel(field, fieldToFind);
        return field.id ? field.id.toUpperCase() === formattedFieldName.toUpperCase() : false;
    };
    WidgetVisibilityService.prototype.removeLabel = function (field, fieldToFind) {
        var formattedFieldName = fieldToFind || '';
        if (field.fieldType === 'RestFieldRepresentation' && fieldToFind.indexOf('_LABEL') > 0) {
            formattedFieldName = fieldToFind.substring(0, fieldToFind.length - 6);
        }
        return formattedFieldName;
    };
    WidgetVisibilityService.prototype.getVariableValue = function (form, name, processVarList) {
        return this.getFormVariableValue(form, name) ||
            this.getProcessVariableValue(name, processVarList);
    };
    WidgetVisibilityService.prototype.getFormVariableValue = function (form, name) {
        if (form.json.variables) {
            var formVariable = form.json.variables.find(function (formVar) { return formVar.name === name; });
            return formVariable ? formVariable.value : formVariable;
        }
    };
    WidgetVisibilityService.prototype.getProcessVariableValue = function (name, processVarList) {
        if (this.processVarList) {
            var processVariable = this.processVarList.find(function (variable) { return variable.id === name; });
            return processVariable ? processVariable.value : processVariable;
        }
    };
    WidgetVisibilityService.prototype.evaluateLogicalOperation = function (logicOp, previousValue, newValue) {
        switch (logicOp) {
            case 'and':
                return previousValue && newValue;
            case 'or':
                return previousValue || newValue;
            case 'and-not':
                return previousValue && !newValue;
            case 'or-not':
                return previousValue || !newValue;
            default:
                this.logService.error('NO valid operation! wrong op request : ' + logicOp);
                break;
        }
    };
    WidgetVisibilityService.prototype.evaluateCondition = function (leftValue, rightValue, operator) {
        switch (operator) {
            case '==':
                return leftValue + '' === rightValue + '';
            case '<':
                return leftValue < rightValue;
            case '!=':
                return leftValue + '' !== rightValue + '';
            case '>':
                return leftValue > rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            case 'empty':
                return leftValue ? leftValue === '' : true;
            case '!empty':
                return leftValue ? leftValue !== '' : false;
            default:
                this.logService.error('NO valid operation!');
                break;
        }
        return;
    };
    WidgetVisibilityService.prototype.cleanProcessVariable = function () {
        this.processVarList = [];
    };
    WidgetVisibilityService.prototype.getTaskProcessVariable = function (taskId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().activiti.taskFormsApi.getTaskFormVariables(taskId))
            .map(function (res) {
            var jsonRes = _this.toJson(res);
            _this.processVarList = jsonRes;
            return jsonRes;
        })
            .catch(function (err) { return _this.handleError(err); });
    };
    WidgetVisibilityService.prototype.toJson = function (res) {
        return res || {};
    };
    WidgetVisibilityService.prototype.handleError = function (err) {
        this.logService.error('Error while performing a call');
        return Rx_1.Observable.throw('Error while performing a call - Server error');
    };
    WidgetVisibilityService = __decorate([
        core_1.Injectable()
    ], WidgetVisibilityService);
    return WidgetVisibilityService;
}());
exports.WidgetVisibilityService = WidgetVisibilityService;
