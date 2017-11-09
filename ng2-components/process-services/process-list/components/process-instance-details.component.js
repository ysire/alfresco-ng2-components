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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var process_instance_header_component_1 = require("./process-instance-header.component");
var process_instance_tasks_component_1 = require("./process-instance-tasks.component");
var ProcessInstanceDetailsComponent = (function () {
    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess   Process service
     */
    function ProcessInstanceDetailsComponent(activitiProcess, logService) {
        this.activitiProcess = activitiProcess;
        this.logService = logService;
        this.showTitle = true;
        this.showRefreshButton = true;
        this.processCancelled = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.taskClick = new core_1.EventEmitter();
        this.showProcessDiagram = new core_1.EventEmitter();
    }
    ProcessInstanceDetailsComponent.prototype.ngOnChanges = function (changes) {
        var processInstanceId = changes['processInstanceId'];
        if (processInstanceId && !processInstanceId.currentValue) {
            this.reset();
            return;
        }
        if (processInstanceId && processInstanceId.currentValue) {
            this.load(processInstanceId.currentValue);
            return;
        }
    };
    /**
     * Reset the task detail to undefined
     */
    ProcessInstanceDetailsComponent.prototype.reset = function () {
        this.processInstanceDetails = null;
    };
    ProcessInstanceDetailsComponent.prototype.load = function (processId) {
        var _this = this;
        if (processId) {
            this.activitiProcess.getProcess(processId).subscribe(function (res) {
                _this.processInstanceDetails = res;
            });
        }
    };
    ProcessInstanceDetailsComponent.prototype.isRunning = function () {
        return this.processInstanceDetails && !this.processInstanceDetails.ended;
    };
    ProcessInstanceDetailsComponent.prototype.isDiagramDisabled = function () {
        return !this.isRunning() ? true : undefined;
    };
    ProcessInstanceDetailsComponent.prototype.cancelProcess = function () {
        var _this = this;
        this.activitiProcess.cancelProcess(this.processInstanceId).subscribe(function (data) {
            _this.processCancelled.emit(data);
        }, function (err) {
            _this.error.emit(err);
        });
    };
    // bubbles (taskClick) event
    ProcessInstanceDetailsComponent.prototype.onTaskClicked = function (event) {
        this.taskClick.emit(event);
    };
    ProcessInstanceDetailsComponent.prototype.getProcessNameOrDescription = function (dateFormat) {
        var name = '';
        if (this.processInstanceDetails) {
            name = this.processInstanceDetails.name ||
                this.processInstanceDetails.processDefinitionName + ' - ' + this.getFormatDate(this.processInstanceDetails.started, dateFormat);
        }
        return name;
    };
    ProcessInstanceDetailsComponent.prototype.getFormatDate = function (value, format) {
        var datePipe = new common_1.DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        }
        catch (err) {
            this.logService.error("ProcessListInstanceHeader: error parsing date " + value + " to format " + format);
        }
    };
    ProcessInstanceDetailsComponent.prototype.onShowProcessDiagram = function (processInstanceId) {
        this.showProcessDiagram.emit({ value: this.processInstanceId });
    };
    __decorate([
        core_1.Input()
    ], ProcessInstanceDetailsComponent.prototype, "processInstanceId", void 0);
    __decorate([
        core_1.ViewChild(process_instance_header_component_1.ProcessInstanceHeaderComponent)
    ], ProcessInstanceDetailsComponent.prototype, "processInstanceHeader", void 0);
    __decorate([
        core_1.ViewChild(process_instance_tasks_component_1.ProcessInstanceTasksComponent)
    ], ProcessInstanceDetailsComponent.prototype, "tasksList", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceDetailsComponent.prototype, "showTitle", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceDetailsComponent.prototype, "showRefreshButton", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceDetailsComponent.prototype, "processCancelled", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceDetailsComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceDetailsComponent.prototype, "taskClick", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceDetailsComponent.prototype, "showProcessDiagram", void 0);
    ProcessInstanceDetailsComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-instance-details',
            templateUrl: './process-instance-details.component.html',
            styleUrls: ['./process-instance-details.component.css']
        })
    ], ProcessInstanceDetailsComponent);
    return ProcessInstanceDetailsComponent;
}());
exports.ProcessInstanceDetailsComponent = ProcessInstanceDetailsComponent;
