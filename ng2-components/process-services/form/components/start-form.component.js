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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var form_component_1 = require("./form.component");
var index_1 = require("./widgets/core/index");
/**
 * Displays the start form for a named process definition, which can be used to retrieve values to start a new process.
 *
 * After the form has been completed the form values are available from the attribute component.form.values and
 * component.form.isValid (boolean) can be used to check the if the form is valid or not. Both of these properties are
 * updated as the user types into the form.
 *
 * @Input
 * {processDefinitionId} string: The process definition ID
 * {showOutcomeButtons} boolean: Whether form outcome buttons should be shown, this is now always active to show form outcomes
 *  @Output
 *  {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *  {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *  {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {FormComponent} .
 */
var StartFormComponent = (function (_super) {
    __extends(StartFormComponent, _super);
    function StartFormComponent(formService, visibilityService, logService) {
        var _this = _super.call(this, formService, visibilityService, null, null) || this;
        _this.showOutcomeButtons = true;
        _this.showRefreshButton = true;
        _this.readOnlyForm = false;
        _this.outcomeClick = new core_1.EventEmitter();
        _this.formContentClicked = new core_1.EventEmitter();
        _this.outcomesContainer = null;
        _this.showTitle = false;
        return _this;
    }
    StartFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.formService.formContentClicked.subscribe(function (content) {
            _this.formContentClicked.emit(content);
        });
    };
    StartFormComponent.prototype.ngOnChanges = function (changes) {
        var processDefinitionId = changes['processDefinitionId'];
        if (processDefinitionId && processDefinitionId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(processDefinitionId.currentValue);
            return;
        }
        var processId = changes['processId'];
        if (processId && processId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(processId.currentValue);
            return;
        }
    };
    StartFormComponent.prototype.loadStartForm = function (processId) {
        var _this = this;
        this.formService.getProcessIntance(processId)
            .subscribe(function (intance) {
            _this.formService
                .getStartFormInstance(processId)
                .subscribe(function (form) {
                _this.formName = form.name;
                if (intance.variables) {
                    form.processVariables = intance.variables;
                }
                _this.form = _this.parseForm(form);
                _this.form.readOnly = _this.readOnlyForm;
                _this.onFormLoaded(_this.form);
            }, function (error) { return _this.handleError(error); });
        });
    };
    StartFormComponent.prototype.getStartFormDefinition = function (processId) {
        var _this = this;
        this.formService
            .getStartFormDefinition(processId)
            .subscribe(function (form) {
            _this.formName = form.processDefinitionName;
            _this.form = _this.parseForm(form);
            _this.form.readOnly = _this.readOnlyForm;
            _this.onFormLoaded(_this.form);
        }, function (error) { return _this.handleError(error); });
    };
    /** @override */
    StartFormComponent.prototype.isOutcomeButtonVisible = function (outcome, isFormReadOnly) {
        if (outcome && outcome.isSystem && (outcome.name === index_1.FormOutcomeModel.SAVE_ACTION ||
            outcome.name === index_1.FormOutcomeModel.COMPLETE_ACTION)) {
            return false;
        }
        else if (outcome && outcome.name === index_1.FormOutcomeModel.START_PROCESS_ACTION) {
            return true;
        }
        return _super.prototype.isOutcomeButtonVisible.call(this, outcome, isFormReadOnly);
    };
    /** @override */
    StartFormComponent.prototype.saveTaskForm = function () {
        // do nothing
    };
    /** @override */
    StartFormComponent.prototype.onRefreshClicked = function () {
        if (this.processDefinitionId) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(this.processDefinitionId);
        }
        else if (this.processId) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(this.processId);
        }
    };
    StartFormComponent.prototype.completeTaskForm = function (outcome) {
        this.outcomeClick.emit(outcome);
    };
    __decorate([
        core_1.Input()
    ], StartFormComponent.prototype, "processDefinitionId", void 0);
    __decorate([
        core_1.Input()
    ], StartFormComponent.prototype, "processId", void 0);
    __decorate([
        core_1.Input()
    ], StartFormComponent.prototype, "showOutcomeButtons", void 0);
    __decorate([
        core_1.Input()
    ], StartFormComponent.prototype, "showRefreshButton", void 0);
    __decorate([
        core_1.Input()
    ], StartFormComponent.prototype, "readOnlyForm", void 0);
    __decorate([
        core_1.Output()
    ], StartFormComponent.prototype, "outcomeClick", void 0);
    __decorate([
        core_1.Output()
    ], StartFormComponent.prototype, "formContentClicked", void 0);
    __decorate([
        core_1.ViewChild('outcomesContainer', {})
    ], StartFormComponent.prototype, "outcomesContainer", void 0);
    StartFormComponent = __decorate([
        core_1.Component({
            selector: 'adf-start-form',
            templateUrl: './start-form.component.html',
            styleUrls: ['./form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], StartFormComponent);
    return StartFormComponent;
}(form_component_1.FormComponent));
exports.StartFormComponent = StartFormComponent;
