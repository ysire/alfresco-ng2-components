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
var Rx_1 = require("rxjs/Rx");
var form_definition_model_1 = require("../models/form-definition.model");
var index_1 = require("./../components/widgets/core/index");
var ecm_model_service_1 = require("./ecm-model.service");
var FormService = (function () {
    function FormService(ecmModelService, apiService, logService) {
        this.ecmModelService = ecmModelService;
        this.apiService = apiService;
        this.logService = logService;
        this.formLoaded = new Rx_1.Subject();
        this.formDataRefreshed = new Rx_1.Subject();
        this.formFieldValueChanged = new Rx_1.Subject();
        this.formEvents = new Rx_1.Subject();
        this.taskCompleted = new Rx_1.Subject();
        this.taskCompletedError = new Rx_1.Subject();
        this.taskSaved = new Rx_1.Subject();
        this.taskSavedError = new Rx_1.Subject();
        this.formContentClicked = new Rx_1.Subject();
        this.validateForm = new Rx_1.Subject();
        this.validateFormField = new Rx_1.Subject();
        this.validateDynamicTableRow = new Rx_1.Subject();
        this.executeOutcome = new Rx_1.Subject();
    }
    FormService_1 = FormService;
    Object.defineProperty(FormService.prototype, "taskApi", {
        get: function () {
            return this.apiService.getInstance().activiti.taskApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "modelsApi", {
        get: function () {
            return this.apiService.getInstance().activiti.modelsApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "editorApi", {
        get: function () {
            return this.apiService.getInstance().activiti.editorApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "processApi", {
        get: function () {
            return this.apiService.getInstance().activiti.processApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "processInstanceVariablesApi", {
        get: function () {
            return this.apiService.getInstance().activiti.processInstanceVariablesApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "usersWorkflowApi", {
        get: function () {
            return this.apiService.getInstance().activiti.usersWorkflowApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "groupsApi", {
        get: function () {
            return this.apiService.getInstance().activiti.groupsApi;
        },
        enumerable: true,
        configurable: true
    });
    FormService.prototype.parseForm = function (json, data, readOnly) {
        if (readOnly === void 0) { readOnly = false; }
        if (json) {
            var form = new index_1.FormModel(json, data, readOnly, this);
            if (!json.fields) {
                form.outcomes = [
                    new index_1.FormOutcomeModel(form, {
                        id: '$custom',
                        name: index_1.FormOutcomeModel.SAVE_ACTION,
                        isSystem: true
                    })
                ];
            }
            return form;
        }
        return null;
    };
    /**
     * Create a Form with a fields for each metadata properties
     * @returns {Observable<any>}
     */
    FormService.prototype.createFormFromANode = function (formName) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.createForm(formName).subscribe(function (form) {
                _this.ecmModelService.searchEcmType(formName, ecm_model_service_1.EcmModelService.MODEL_NAME).subscribe(function (customType) {
                    var formDefinitionModel = new form_definition_model_1.FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                    _this.addFieldsToAForm(form.id, formDefinitionModel).subscribe(function (formData) {
                        observer.next(formData);
                        observer.complete();
                    }, function (err) { return _this.handleError(err); });
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    /**
     * Create a Form
     * @returns {Observable<any>}
     */
    FormService.prototype.createForm = function (formName) {
        var dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };
        return Rx_1.Observable.fromPromise(this.modelsApi.createModel(dataModel));
    };
    FormService.prototype.saveForm = function (formId, formModel) {
        return Rx_1.Observable.fromPromise(this.editorApi.saveForm(formId, formModel));
    };
    /**
     * @deprecated in 1.7.0, use saveForm API instead
     * Add Fileds to A form
     * @returns {Observable<any>}
     */
    FormService.prototype.addFieldsToAForm = function (formId, formModel) {
        this.logService.log('addFieldsToAForm is deprecated in 1.7.0, use saveForm API instead');
        return Rx_1.Observable.fromPromise(this.editorApi.saveForm(formId, formModel));
    };
    /**
     * Search For A Form by name
     * @returns {Observable<any>}
     */
    FormService.prototype.searchFrom = function (name) {
        var _this = this;
        var opts = {
            'modelType': 2
        };
        return Rx_1.Observable.fromPromise(this.modelsApi.getModels(opts))
            .map(function (forms) {
            return forms.data.find(function (formdata) { return formdata.name === name; });
        })
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get All the forms
     * @returns {Observable<any>}
     */
    FormService.prototype.getForms = function () {
        var _this = this;
        var opts = {
            'modelType': 2
        };
        return Rx_1.Observable.fromPromise(this.modelsApi.getModels(opts))
            .map(this.toJsonArray)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get Process Definitions
     * @returns {Observable<any>}
     */
    FormService.prototype.getProcessDefinitions = function () {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getProcessDefinitions({}))
            .map(this.toJsonArray)
            .catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getProcessVarablesById = function (processInstanceId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get All the Tasks
     * @returns {Observable<any>}
     */
    FormService.prototype.getTasks = function () {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.taskApi.listTasks({}))
            .map(this.toJsonArray)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get Task
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    FormService.prototype.getTask = function (taskId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.taskApi.getTask(taskId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Save Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns {Observable<any>}
     */
    FormService.prototype.saveTaskForm = function (taskId, formValues) {
        var _this = this;
        var body = JSON.stringify({ values: formValues });
        return Rx_1.Observable.fromPromise(this.taskApi.saveTaskForm(taskId, body))
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Complete Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns {Observable<any>}
     */
    FormService.prototype.completeTaskForm = function (taskId, formValues, outcome) {
        var _this = this;
        var data = { values: formValues };
        if (outcome) {
            data.outcome = outcome;
        }
        var body = JSON.stringify(data);
        return Rx_1.Observable.fromPromise(this.taskApi.completeTaskForm(taskId, body))
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get Form related to a taskId
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    FormService.prototype.getTaskForm = function (taskId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.taskApi.getTaskForm(taskId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get Form Definition
     * @param formId Form Id
     * @returns {Observable<any>}
     */
    FormService.prototype.getFormDefinitionById = function (formId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.editorApi.getForm(formId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Returns form definition by a given name.
     * @param name
     * @returns {Promise<T>|Promise<ErrorObservable>}
     */
    FormService.prototype.getFormDefinitionByName = function (name) {
        var _this = this;
        var opts = {
            'filter': 'myReusableForms',
            'filterText': name,
            'modelType': 2
        };
        return Rx_1.Observable.fromPromise(this.modelsApi.getModels(opts))
            .map(this.getFormId)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get start form instance for a given processId
     * @param processId Process definition ID
     * @returns {Observable<any>}
     */
    FormService.prototype.getStartFormInstance = function (processId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getProcessInstanceStartForm(processId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getProcessIntance = function (processId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getProcessInstance(processId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Get start form definition for a given process
     * @param processId Process definition ID
     * @returns {Observable<any>}
     */
    FormService.prototype.getStartFormDefinition = function (processId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getProcessDefinitionStartForm(processId))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getRestFieldValues = function (taskId, field) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.taskApi.getRestFieldValues(taskId, field)).catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getRestFieldValuesByProcessId = function (processDefinitionId, field) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getRestFieldValues(processDefinitionId, field)).catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getRestFieldValuesColumnByProcessId = function (processDefinitionId, field, column) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.processApi.getRestTableFieldValues(processDefinitionId, field, column)).catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getRestFieldValuesColumn = function (taskId, field, column) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.taskApi.getRestFieldValuesColumn(taskId, field, column)).catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getUserProfileImageApi = function (userId) {
        return this.apiService.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    };
    FormService.prototype.getWorkflowUsers = function (filter, groupId) {
        var _this = this;
        var option = { filter: filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return Rx_1.Observable.fromPromise(this.usersWorkflowApi.getUsers(option))
            .switchMap(function (response) { return response.data || []; })
            .map(function (user) {
            user.userImage = _this.getUserProfileImageApi(user.id);
            return Rx_1.Observable.of(user);
        })
            .combineAll()
            .defaultIfEmpty([])
            .catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getWorkflowGroups = function (filter, groupId) {
        var _this = this;
        var option = { filter: filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return Rx_1.Observable.fromPromise(this.groupsApi.getGroups(option))
            .map(function (response) { return response.data || []; })
            .catch(function (err) { return _this.handleError(err); });
    };
    FormService.prototype.getFormId = function (res) {
        var result = null;
        if (res && res.data && res.data.length > 0) {
            result = res.data[0].id;
        }
        return result;
    };
    FormService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    FormService.prototype.toJsonArray = function (res) {
        if (res) {
            return res.data || [];
        }
        return [];
    };
    FormService.prototype.handleError = function (error) {
        var errMsg = FormService_1.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? error.status + " - " + error.statusText : FormService_1.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return Rx_1.Observable.throw(errMsg);
    };
    FormService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    FormService.GENERIC_ERROR_MESSAGE = 'Server error';
    FormService = FormService_1 = __decorate([
        core_1.Injectable()
    ], FormService);
    return FormService;
    var FormService_1;
}());
exports.FormService = FormService;
