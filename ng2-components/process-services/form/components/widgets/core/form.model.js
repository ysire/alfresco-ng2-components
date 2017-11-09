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
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:component-selector  */
var index_1 = require("./../../../events/index");
var container_model_1 = require("./container.model");
var form_field_types_1 = require("./form-field-types");
var form_field_model_1 = require("./form-field.model");
var form_outcome_model_1 = require("./form-outcome.model");
var tab_model_1 = require("./tab.model");
var form_field_validator_1 = require("./form-field-validator");
var FormModel = (function () {
    function FormModel(json, data, readOnly, formService) {
        if (readOnly === void 0) { readOnly = false; }
        var _this = this;
        this.formService = formService;
        this.taskName = FormModel.UNSET_TASK_NAME;
        this._isValid = true;
        this.readOnly = false;
        this.tabs = [];
        /** Stores root containers */
        this.fields = [];
        this.outcomes = [];
        this.customFieldTemplates = {};
        this.fieldValidators = form_field_validator_1.FORM_FIELD_VALIDATORS.slice();
        this.values = {};
        this.readOnly = readOnly;
        if (json) {
            this.json = json;
            this.id = json.id;
            this.name = json.name;
            this.taskId = json.taskId;
            this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
            this.processDefinitionId = json.processDefinitionId;
            this.customFieldTemplates = json.customFieldTemplates || {};
            this.selectedOutcome = json.selectedOutcome || {};
            this.className = json.className || '';
            var tabCache_1 = {};
            this.processVariables = json.processVariables;
            this.tabs = (json.tabs || []).map(function (t) {
                var model = new tab_model_1.TabModel(_this, t);
                tabCache_1[model.id] = model;
                return model;
            });
            this.fields = this.parseRootFields(json);
            if (data) {
                this.loadData(data);
            }
            for (var i = 0; i < this.fields.length; i++) {
                var field = this.fields[i];
                if (field.tab) {
                    var tab = tabCache_1[field.tab];
                    if (tab) {
                        tab.fields.push(field);
                    }
                }
            }
            if (json.fields) {
                var saveOutcome = new form_outcome_model_1.FormOutcomeModel(this, { id: FormModel.SAVE_OUTCOME, name: 'Save', isSystem: true });
                var completeOutcome = new form_outcome_model_1.FormOutcomeModel(this, { id: FormModel.COMPLETE_OUTCOME, name: 'Complete', isSystem: true });
                var startProcessOutcome = new form_outcome_model_1.FormOutcomeModel(this, { id: FormModel.START_PROCESS_OUTCOME, name: 'Start Process', isSystem: true });
                var customOutcomes = (json.outcomes || []).map(function (obj) { return new form_outcome_model_1.FormOutcomeModel(_this, obj); });
                this.outcomes = [saveOutcome].concat(customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]);
            }
        }
        this.validateForm();
    }
    Object.defineProperty(FormModel.prototype, "isValid", {
        get: function () {
            return this._isValid;
        },
        enumerable: true,
        configurable: true
    });
    FormModel.prototype.hasTabs = function () {
        return this.tabs && this.tabs.length > 0;
    };
    FormModel.prototype.hasFields = function () {
        return this.fields && this.fields.length > 0;
    };
    FormModel.prototype.hasOutcomes = function () {
        return this.outcomes && this.outcomes.length > 0;
    };
    FormModel.prototype.onFormFieldChanged = function (field) {
        this.validateField(field);
        if (this.formService) {
            this.formService.formFieldValueChanged.next(new index_1.FormFieldEvent(this, field));
        }
    };
    FormModel.prototype.getFieldById = function (fieldId) {
        return this.getFormFields().find(function (field) { return field.id === fieldId; });
    };
    // TODO: consider evaluating and caching once the form is loaded
    FormModel.prototype.getFormFields = function () {
        var result = [];
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field instanceof container_model_1.ContainerModel) {
                var container = field;
                result.push(container.field);
                container.field.columns.forEach(function (column) {
                    result.push.apply(result, column.fields);
                });
            }
        }
        return result;
    };
    FormModel.prototype.markAsInvalid = function () {
        this._isValid = false;
    };
    /**
     * Validates entire form and all form fields.
     *
     * @returns {void}
     * @memberof FormModel
     */
    FormModel.prototype.validateForm = function () {
        var validateFormEvent = new index_1.ValidateFormEvent(this);
        if (this.formService) {
            this.formService.validateForm.next(validateFormEvent);
        }
        this._isValid = validateFormEvent.isValid;
        if (validateFormEvent.defaultPrevented) {
            return;
        }
        if (validateFormEvent.isValid) {
            var fields = this.getFormFields();
            for (var i = 0; i < fields.length; i++) {
                if (!fields[i].validate()) {
                    this._isValid = false;
                    return;
                }
            }
        }
    };
    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param {FormFieldModel} field Form field to validate.
     * @returns {void}
     * @memberof FormModel
     */
    FormModel.prototype.validateField = function (field) {
        if (!field) {
            return;
        }
        var validateFieldEvent = new index_1.ValidateFormFieldEvent(this, field);
        if (this.formService) {
            this.formService.validateFormField.next(validateFieldEvent);
        }
        if (!validateFieldEvent.isValid) {
            this._isValid = false;
            return;
        }
        if (validateFieldEvent.defaultPrevented) {
            return;
        }
        if (!field.validate()) {
            this._isValid = false;
            return;
        }
        this.validateForm();
    };
    // Activiti supports 3 types of root fields: container|group|dynamic-table
    FormModel.prototype.parseRootFields = function (json) {
        var fields = [];
        if (json.fields) {
            fields = json.fields;
        }
        else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }
        var result = [];
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            if (field.type === form_field_types_1.FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    var originalField = field.params['field'];
                    if (originalField.type === form_field_types_1.FormFieldTypes.DYNAMIC_TABLE) {
                        result.push(new container_model_1.ContainerModel(new form_field_model_1.FormFieldModel(this, field)));
                    }
                }
            }
            else {
                result.push(new container_model_1.ContainerModel(new form_field_model_1.FormFieldModel(this, field)));
            }
        }
        return result;
    };
    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    FormModel.prototype.loadData = function (data) {
        for (var _i = 0, _a = this.getFormFields(); _i < _a.length; _i++) {
            var field = _a[_i];
            if (data[field.id]) {
                field.json.value = data[field.id];
                field.value = field.parseValue(field.json);
                if (field.type === form_field_types_1.FormFieldTypes.DROPDOWN ||
                    field.type === form_field_types_1.FormFieldTypes.RADIO_BUTTONS) {
                    field.value = data[field.id].id;
                }
            }
        }
    };
    FormModel.UNSET_TASK_NAME = 'Nameless task';
    FormModel.SAVE_OUTCOME = '$save';
    FormModel.COMPLETE_OUTCOME = '$complete';
    FormModel.START_PROCESS_OUTCOME = '$startProcess';
    return FormModel;
}());
exports.FormModel = FormModel;
