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
/* tslint:disable */
var core_1 = require("@angular/core");
var index_1 = require("./../events/index");
var ecm_model_service_1 = require("./../services/ecm-model.service");
var index_2 = require("./widgets/core/index");
var Rx_1 = require("rxjs/Rx");
var FormComponent = (function () {
    function FormComponent(formService, visibilityService, ecmModelService, nodeService) {
        this.formService = formService;
        this.visibilityService = visibilityService;
        this.ecmModelService = ecmModelService;
        this.nodeService = nodeService;
        this.saveMetadata = false;
        this.showTitle = true;
        this.showCompleteButton = true;
        this.disableCompleteButton = false;
        this.disableStartProcessButton = false;
        this.showSaveButton = true;
        this.showDebugButton = false;
        this.readOnly = false;
        this.showRefreshButton = true;
        this.showValidationIcon = true;
        this.fieldValidators = [];
        this.formSaved = new core_1.EventEmitter();
        this.formCompleted = new core_1.EventEmitter();
        this.formContentClicked = new core_1.EventEmitter();
        this.formLoaded = new core_1.EventEmitter();
        this.formDataRefreshed = new core_1.EventEmitter();
        this.executeOutcome = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        this.debugMode = false;
    }
    FormComponent_1 = FormComponent;
    FormComponent.prototype.hasForm = function () {
        return this.form ? true : false;
    };
    FormComponent.prototype.isTitleEnabled = function () {
        if (this.showTitle) {
            if (this.form && this.form.taskName) {
                return true;
            }
        }
        return false;
    };
    FormComponent.prototype.isOutcomeButtonEnabled = function (outcome) {
        if (this.form.readOnly) {
            return false;
        }
        if (outcome) {
            // Make 'Save' button always available
            if (outcome.name === index_2.FormOutcomeModel.SAVE_ACTION) {
                return true;
            }
            if (outcome.name === index_2.FormOutcomeModel.COMPLETE_ACTION) {
                return this.disableCompleteButton ? false : this.form.isValid;
            }
            if (outcome.name === index_2.FormOutcomeModel.START_PROCESS_ACTION) {
                return this.disableStartProcessButton ? false : this.form.isValid;
            }
            return this.form.isValid;
        }
        return false;
    };
    FormComponent.prototype.isOutcomeButtonVisible = function (outcome, isFormReadOnly) {
        if (outcome && outcome.name) {
            if (outcome.name === index_2.FormOutcomeModel.COMPLETE_ACTION) {
                return this.showCompleteButton;
            }
            if (isFormReadOnly) {
                return outcome.isSelected;
            }
            if (outcome.name === index_2.FormOutcomeModel.SAVE_ACTION) {
                return this.showSaveButton;
            }
            if (outcome.name === index_2.FormOutcomeModel.START_PROCESS_ACTION) {
                return false;
            }
            return true;
        }
        return false;
    };
    FormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.formService.formContentClicked.subscribe(function (content) {
            _this.formContentClicked.emit(content);
        });
    };
    FormComponent.prototype.ngOnChanges = function (changes) {
        var taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getFormByTaskId(taskId.currentValue);
            return;
        }
        var formId = changes['formId'];
        if (formId && formId.currentValue) {
            this.getFormDefinitionByFormId(formId.currentValue);
            return;
        }
        var formName = changes['formName'];
        if (formName && formName.currentValue) {
            this.getFormDefinitionByFormName(formName.currentValue);
            return;
        }
        var nodeId = changes['nodeId'];
        if (nodeId && nodeId.currentValue) {
            this.loadFormForEcmNode(nodeId.currentValue);
            return;
        }
        var data = changes['data'];
        if (data && data.currentValue) {
            this.refreshFormData();
            return;
        }
    };
    /**
     * Invoked when user clicks outcome button.
     * @param outcome Form outcome model
     * @returns {boolean} True if outcome action was executed, otherwise false.
     */
    FormComponent.prototype.onOutcomeClicked = function (outcome) {
        if (!this.readOnly && outcome && this.form) {
            if (!this.onExecuteOutcome(outcome)) {
                return false;
            }
            if (outcome.isSystem) {
                if (outcome.id === FormComponent_1.SAVE_OUTCOME_ID) {
                    this.saveTaskForm();
                    return true;
                }
                if (outcome.id === FormComponent_1.COMPLETE_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }
                if (outcome.id === FormComponent_1.START_PROCESS_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }
                if (outcome.id === FormComponent_1.CUSTOM_OUTCOME_ID) {
                    this.onTaskSaved(this.form);
                    this.storeFormAsMetadata();
                    return true;
                }
            }
            else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.onTaskSaved(this.form);
                    this.completeTaskForm(outcome.name);
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Invoked when user clicks form refresh button.
     */
    FormComponent.prototype.onRefreshClicked = function () {
        this.loadForm();
    };
    FormComponent.prototype.loadForm = function () {
        if (this.taskId) {
            this.getFormByTaskId(this.taskId);
            return;
        }
        if (this.formId) {
            this.getFormDefinitionByFormId(this.formId);
            return;
        }
        if (this.formName) {
            this.getFormDefinitionByFormName(this.formName);
            return;
        }
    };
    FormComponent.prototype.findProcessVariablesByTaskId = function (taskId) {
        var _this = this;
        return this.formService.getTask(taskId).
            switchMap(function (task) {
            if (_this.isAProcessTask(task)) {
                return _this.visibilityService.getTaskProcessVariable(taskId);
            }
            else {
                return Rx_1.Observable.of({});
            }
        });
    };
    FormComponent.prototype.isAProcessTask = function (taskRepresentation) {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    };
    FormComponent.prototype.getFormByTaskId = function (taskId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.findProcessVariablesByTaskId(taskId).subscribe(function (processVariables) {
                _this.formService
                    .getTaskForm(taskId)
                    .subscribe(function (form) {
                    var parsedForm = _this.parseForm(form);
                    _this.visibilityService.refreshVisibility(parsedForm);
                    _this.form = parsedForm;
                    _this.onFormLoaded(_this.form);
                    resolve(_this.form);
                }, function (error) {
                    _this.handleError(error);
                    // reject(error);
                    resolve(null);
                });
            });
        });
    };
    FormComponent.prototype.getFormDefinitionByFormId = function (formId) {
        var _this = this;
        this.formService
            .getFormDefinitionById(formId)
            .subscribe(function (form) {
            _this.formName = form.name;
            _this.form = _this.parseForm(form);
            _this.onFormLoaded(_this.form);
        }, function (error) {
            _this.handleError(error);
        });
    };
    FormComponent.prototype.getFormDefinitionByFormName = function (formName) {
        var _this = this;
        this.formService
            .getFormDefinitionByName(formName)
            .subscribe(function (id) {
            _this.formService.getFormDefinitionById(id).subscribe(function (form) {
                _this.form = _this.parseForm(form);
                _this.onFormLoaded(_this.form);
            }, function (error) {
                _this.handleError(error);
            });
        }, function (error) {
            _this.handleError(error);
        });
    };
    FormComponent.prototype.saveTaskForm = function () {
        var _this = this;
        if (this.form && this.form.taskId) {
            this.formService
                .saveTaskForm(this.form.taskId, this.form.values)
                .subscribe(function () {
                _this.onTaskSaved(_this.form);
                _this.storeFormAsMetadata();
            }, function (error) { return _this.onTaskSavedError(_this.form, error); });
        }
    };
    FormComponent.prototype.completeTaskForm = function (outcome) {
        var _this = this;
        if (this.form && this.form.taskId) {
            this.formService
                .completeTaskForm(this.form.taskId, this.form.values, outcome)
                .subscribe(function () {
                _this.onTaskCompleted(_this.form);
                _this.storeFormAsMetadata();
            }, function (error) { return _this.onTaskCompletedError(_this.form, error); });
        }
    };
    FormComponent.prototype.handleError = function (err) {
        this.onError.emit(err);
    };
    FormComponent.prototype.parseForm = function (json) {
        if (json) {
            var form = new index_2.FormModel(json, this.data, this.readOnly, this.formService);
            if (!json.fields) {
                form.outcomes = this.getFormDefinitionOutcomes(form);
            }
            if (this.fieldValidators && this.fieldValidators.length > 0) {
                form.fieldValidators = this.fieldValidators;
            }
            return form;
        }
        return null;
    };
    /**
     * Get custom set of outcomes for a Form Definition.
     * @param form Form definition model.
     * @returns {FormOutcomeModel[]} Outcomes for a given form definition.
     */
    FormComponent.prototype.getFormDefinitionOutcomes = function (form) {
        return [
            new index_2.FormOutcomeModel(form, { id: '$custom', name: index_2.FormOutcomeModel.SAVE_ACTION, isSystem: true })
        ];
    };
    FormComponent.prototype.checkVisibility = function (field) {
        if (field && field.form) {
            this.visibilityService.refreshVisibility(field.form);
        }
    };
    FormComponent.prototype.refreshFormData = function () {
        this.form = this.parseForm(this.form.json);
        this.onFormLoaded(this.form);
        this.onFormDataRefreshed(this.form);
    };
    FormComponent.prototype.loadFormForEcmNode = function (nodeId) {
        var _this = this;
        this.nodeService.getNodeMetadata(nodeId).subscribe(function (data) {
            _this.data = data.metadata;
            _this.loadFormFromActiviti(data.nodeType);
        }, this.handleError);
    };
    FormComponent.prototype.loadFormFromActiviti = function (nodeType) {
        var _this = this;
        this.formService.searchFrom(nodeType).subscribe(function (form) {
            if (!form) {
                _this.formService.createFormFromANode(nodeType).subscribe(function (formMetadata) {
                    _this.loadFormFromFormId(formMetadata.id);
                });
            }
            else {
                _this.loadFormFromFormId(form.id);
            }
        }, function (error) {
            _this.handleError(error);
        });
    };
    FormComponent.prototype.loadFormFromFormId = function (formId) {
        this.formId = formId;
        this.loadForm();
    };
    FormComponent.prototype.storeFormAsMetadata = function () {
        var _this = this;
        if (this.saveMetadata) {
            this.ecmModelService.createEcmTypeForActivitiForm(this.formName, this.form).subscribe(function (type) {
                _this.nodeService.createNodeMetadata(type.nodeType || type.entry.prefixedName, ecm_model_service_1.EcmModelService.MODEL_NAMESPACE, _this.form.values, _this.path, _this.nameNode);
            }, function (error) {
                _this.handleError(error);
            });
        }
    };
    FormComponent.prototype.onFormLoaded = function (form) {
        this.formLoaded.emit(form);
        this.formService.formLoaded.next(new index_1.FormEvent(form));
    };
    FormComponent.prototype.onFormDataRefreshed = function (form) {
        this.formDataRefreshed.emit(form);
        this.formService.formDataRefreshed.next(new index_1.FormEvent(form));
    };
    FormComponent.prototype.onTaskSaved = function (form) {
        this.formSaved.emit(form);
        this.formService.taskSaved.next(new index_1.FormEvent(form));
    };
    FormComponent.prototype.onTaskSavedError = function (form, error) {
        this.handleError(error);
        this.formService.taskSavedError.next(new index_1.FormErrorEvent(form, error));
    };
    FormComponent.prototype.onTaskCompleted = function (form) {
        this.formCompleted.emit(form);
        this.formService.taskCompleted.next(new index_1.FormEvent(form));
    };
    FormComponent.prototype.onTaskCompletedError = function (form, error) {
        this.handleError(error);
        this.formService.taskCompletedError.next(new index_1.FormErrorEvent(form, error));
    };
    FormComponent.prototype.onExecuteOutcome = function (outcome) {
        var args = new index_2.FormOutcomeEvent(outcome);
        this.formService.executeOutcome.next(args);
        if (args.defaultPrevented) {
            return false;
        }
        this.executeOutcome.emit(args);
        if (args.defaultPrevented) {
            return false;
        }
        return true;
    };
    FormComponent.SAVE_OUTCOME_ID = '$save';
    FormComponent.COMPLETE_OUTCOME_ID = '$complete';
    FormComponent.START_PROCESS_OUTCOME_ID = '$startProcess';
    FormComponent.CUSTOM_OUTCOME_ID = '$custom';
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "taskId", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "formId", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "formName", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "saveMetadata", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "path", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "nameNode", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showTitle", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showCompleteButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "disableCompleteButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "disableStartProcessButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showSaveButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showDebugButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showRefreshButton", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "showValidationIcon", void 0);
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "fieldValidators", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "formSaved", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "formCompleted", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "formContentClicked", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "formLoaded", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "formDataRefreshed", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "executeOutcome", void 0);
    __decorate([
        core_1.Output()
    ], FormComponent.prototype, "onError", void 0);
    FormComponent = FormComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-form',
            templateUrl: './form.component.html',
            styleUrls: ['./form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FormComponent);
    return FormComponent;
    var FormComponent_1;
}());
exports.FormComponent = FormComponent;
