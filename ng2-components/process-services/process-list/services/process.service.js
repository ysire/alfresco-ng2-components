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
var Observable_1 = require("rxjs/Observable");
var filter_process_model_1 = require("../models/filter-process.model");
var process_definition_model_1 = require("../models/process-definition.model");
var process_instance_variable_model_1 = require("../models/process-instance-variable.model");
var process_instance_model_1 = require("../models/process-instance.model");
var ProcessService = (function () {
    function ProcessService(alfrescoApiService, processLogService) {
        this.alfrescoApiService = alfrescoApiService;
        this.processLogService = processLogService;
    }
    ProcessService.prototype.getProcessInstances = function (requestNode, processDefinitionKey) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstances(requestNode))
            .map(function (res) {
            if (processDefinitionKey) {
                return res.data.filter(function (process) { return process.processDefinitionKey === processDefinitionKey; });
            }
            else {
                return res.data;
            }
        }).catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.getProcessFilters = function (appId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.callApiProcessFilters(appId))
            .map(function (response) {
            var filters = [];
            response.data.forEach(function (filter) {
                var filterModel = new filter_process_model_1.FilterProcessRepresentationModel(filter);
                filters.push(filterModel);
            });
            return filters;
        })
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    /**
     * Retrieve the process filter by id
     * @param filterId - number - The id of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    ProcessService.prototype.getProcessFilterById = function (filterId, appId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.callApiProcessFilters(appId))
            .map(function (response) {
            return response.data.find(function (filter) { return filter.id === filterId; });
        }).catch(function (err) { return _this.handleProcessError(err); });
    };
    /**
     * Retrieve the process filter by name
     * @param filterName - string - The name of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    ProcessService.prototype.getProcessFilterByName = function (filterName, appId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.callApiProcessFilters(appId))
            .map(function (response) {
            return response.data.find(function (filter) { return filter.name === filterName; });
        }).catch(function (err) { return _this.handleProcessError(err); });
    };
    /**
     * fetch the Process Audit information as a pdf
     * @param processId - the process id
     */
    ProcessService.prototype.fetchProcessAuditPdfById = function (processId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditPdf(processId))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    /**
     * fetch the Process Audit information in a json format
     * @param processId - the process id
     */
    ProcessService.prototype.fetchProcessAuditJsonById = function (processId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditJson(processId))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterProcessRepresentationModel[]}
     */
    ProcessService.prototype.createDefaultFilters = function (appId) {
        var _this = this;
        var runnintFilter = this.getRunningFilterInstance(appId);
        var runnintObservable = this.addProcessFilter(runnintFilter);
        var completedFilter = this.getCompletedFilterInstance(appId);
        var completedObservable = this.addProcessFilter(completedFilter);
        var allFilter = this.getAllFilterInstance(appId);
        var allObservable = this.addProcessFilter(allFilter);
        return Observable_1.Observable.create(function (observer) {
            Observable_1.Observable.forkJoin(runnintObservable, completedObservable, allObservable).subscribe(function (res) {
                var filters = [];
                res.forEach(function (filter) {
                    if (filter.name === runnintFilter.name) {
                        filters.push(runnintFilter);
                    }
                    else if (filter.name === completedFilter.name) {
                        filters.push(completedFilter);
                    }
                    else if (filter.name === allFilter.name) {
                        filters.push(allFilter);
                    }
                });
                observer.next(filters);
                observer.complete();
            }, function (err) {
                _this.processLogService.error(err);
            });
        });
    };
    ProcessService.prototype.getRunningFilterInstance = function (appId) {
        return new filter_process_model_1.FilterProcessRepresentationModel({
            'name': 'Running',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });
    };
    /**
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    ProcessService.prototype.getCompletedFilterInstance = function (appId) {
        return new filter_process_model_1.FilterProcessRepresentationModel({
            'name': 'Completed',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-ok-sign',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' }
        });
    };
    /**
     * Return a static All filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    ProcessService.prototype.getAllFilterInstance = function (appId) {
        return new filter_process_model_1.FilterProcessRepresentationModel({
            'name': 'All',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-th',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' }
        });
    };
    /**
     * Add a filter
     * @param filter - FilterProcessRepresentationModel
     * @returns {FilterProcessRepresentationModel}
     */
    ProcessService.prototype.addProcessFilter = function (filter) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.callApiAddProcessFilter(filter))
            .map(function (res) { return res; })
            .map(function (response) {
            return response;
        }).catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.getProcess = function (processInstanceId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstance(processInstanceId))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.getProcessTasks = function (processInstanceId, state) {
        var _this = this;
        var taskOpts = state ? {
            processInstanceId: processInstanceId,
            state: state
        } : {
            processInstanceId: processInstanceId
        };
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.taskApi.listTasks(taskOpts))
            .map(this.extractData)
            .map(function (tasks) { return tasks.map(function (task) {
            task.created = moment(task.created, 'YYYY-MM-DD').format();
            return task;
        }); })
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.getProcessDefinitions = function (appId) {
        var _this = this;
        var opts = appId ? {
            latest: true,
            appDefinitionId: appId
        } : {
            latest: true
        };
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessDefinitions(opts))
            .map(this.extractData)
            .map(function (processDefs) { return processDefs.map(function (pd) { return new process_definition_model_1.ProcessDefinitionRepresentation(pd); }); })
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.startProcess = function (processDefinitionId, name, outcome, startFormValues, variables) {
        var _this = this;
        var startRequest = {
            name: name,
            processDefinitionId: processDefinitionId
        };
        if (outcome) {
            startRequest.outcome = outcome;
        }
        if (startFormValues) {
            startRequest.values = startFormValues;
        }
        if (variables) {
            startRequest.variables = variables;
        }
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.startNewProcessInstance(startRequest))
            .map(function (pd) { return new process_instance_model_1.ProcessInstance(pd); })
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.cancelProcess = function (processInstanceId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.deleteProcessInstance(processInstanceId))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.getProcessInstanceVariables = function (processDefinitionId) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.getProcessInstanceVariables(processDefinitionId))
            .map(function (processVars) { return processVars.map(function (pd) { return new process_instance_variable_model_1.ProcessInstanceVariable(pd); }); })
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.createOrUpdateProcessInstanceVariables = function (processDefinitionId, variables) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processDefinitionId, variables))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.deleteProcessInstanceVariable = function (processDefinitionId, variableName) {
        var _this = this;
        return Observable_1.Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.deleteProcessInstanceVariable(processDefinitionId, variableName))
            .catch(function (err) { return _this.handleProcessError(err); });
    };
    ProcessService.prototype.callApiAddProcessFilter = function (filter) {
        return this.alfrescoApiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter);
    };
    ProcessService.prototype.callApiProcessFilters = function (appId) {
        if (appId) {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        }
        else {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters();
        }
    };
    ProcessService.prototype.extractData = function (res) {
        return res.data || {};
    };
    ProcessService.prototype.handleProcessError = function (error) {
        return Observable_1.Observable.throw(error || 'Server error');
    };
    ProcessService = __decorate([
        core_1.Injectable()
    ], ProcessService);
    return ProcessService;
}());
exports.ProcessService = ProcessService;
