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
var ProcessFiltersComponent = (function () {
    function ProcessFiltersComponent(processService, appsProcessService) {
        var _this = this;
        this.processService = processService;
        this.appsProcessService = appsProcessService;
        this.filterClick = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.showIcon = true;
        this.filters = [];
        this.filter$ = new Rx_1.Observable(function (observer) { return _this.filterObserver = observer; }).share();
    }
    ProcessFiltersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filter$.subscribe(function (filter) {
            _this.filters.push(filter);
        });
    };
    ProcessFiltersComponent.prototype.ngOnChanges = function (changes) {
        var appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getFiltersByAppId(appId.currentValue);
            return;
        }
        var appName = changes['appName'];
        if (appName && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
            return;
        }
    };
    /**
     * Return the filter list filtered by appId
     * @param appId - optional
     */
    ProcessFiltersComponent.prototype.getFiltersByAppId = function (appId) {
        var _this = this;
        this.processService.getProcessFilters(appId).subscribe(function (res) {
            if (res.length === 0 && _this.isFilterListEmpty()) {
                _this.processService.createDefaultFilters(appId).subscribe(function (resDefault) {
                    _this.resetFilter();
                    resDefault.forEach(function (filter) {
                        _this.filterObserver.next(filter);
                    });
                    _this.selectProcessFilter(_this.filterParam);
                    _this.success.emit(resDefault);
                }, function (errDefault) {
                    _this.error.emit(errDefault);
                });
            }
            else {
                _this.resetFilter();
                res.forEach(function (filter) {
                    _this.filterObserver.next(filter);
                });
                _this.selectProcessFilter(_this.filterParam);
                _this.success.emit(res);
            }
        }, function (err) {
            _this.error.emit(err);
        });
    };
    /**
     * Return the filter list filtered by appName
     * @param appName
     */
    ProcessFiltersComponent.prototype.getFiltersByAppName = function (appName) {
        var _this = this;
        this.appsProcessService.getDeployedApplicationsByName(appName).subscribe(function (application) {
            _this.getFiltersByAppId(application.id);
            _this.selectProcessFilter(_this.filterParam);
        }, function (err) {
            _this.error.emit(err);
        });
    };
    /**
     * Pass the selected filter as next
     * @param filter
     */
    ProcessFiltersComponent.prototype.selectFilter = function (filter) {
        this.currentFilter = filter;
        this.filterClick.emit(filter);
    };
    /**
     * Select the first filter of a list if present
     */
    ProcessFiltersComponent.prototype.selectProcessFilter = function (filterParam) {
        var _this = this;
        if (filterParam) {
            this.filters.filter(function (processFilter, index) {
                if (filterParam.name && filterParam.name.toLowerCase() === processFilter.name.toLowerCase() || filterParam.index === index) {
                    _this.currentFilter = processFilter;
                }
            });
        }
        if (this.isCurrentFilterEmpty()) {
            this.selectDefaultTaskFilter();
        }
    };
    /**
     * Select the Running filter
     */
    ProcessFiltersComponent.prototype.selectRunningFilter = function () {
        this.selectProcessFilter(this.processService.getRunningFilterInstance(null));
    };
    /**
     * Select as default task filter the first in the list
     */
    ProcessFiltersComponent.prototype.selectDefaultTaskFilter = function () {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    };
    /**
     * Return the current task
     * @returns {ProcessInstanceFilterRepresentation}
     */
    ProcessFiltersComponent.prototype.getCurrentFilter = function () {
        return this.currentFilter;
    };
    /**
     * Check if the filter list is empty
     * @returns {boolean}
     */
    ProcessFiltersComponent.prototype.isFilterListEmpty = function () {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    };
    /**
     * Reset the filters properties
     */
    ProcessFiltersComponent.prototype.resetFilter = function () {
        this.filters = [];
        this.currentFilter = undefined;
    };
    ProcessFiltersComponent.prototype.isCurrentFilterEmpty = function () {
        return this.currentFilter === undefined || null ? true : false;
    };
    __decorate([
        core_1.Input()
    ], ProcessFiltersComponent.prototype, "filterParam", void 0);
    __decorate([
        core_1.Output()
    ], ProcessFiltersComponent.prototype, "filterClick", void 0);
    __decorate([
        core_1.Output()
    ], ProcessFiltersComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output()
    ], ProcessFiltersComponent.prototype, "error", void 0);
    __decorate([
        core_1.Input()
    ], ProcessFiltersComponent.prototype, "appId", void 0);
    __decorate([
        core_1.Input()
    ], ProcessFiltersComponent.prototype, "appName", void 0);
    __decorate([
        core_1.Input()
    ], ProcessFiltersComponent.prototype, "showIcon", void 0);
    ProcessFiltersComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-instance-filters',
            templateUrl: './process-filters.component.html',
            styleUrls: ['process-filters.component.scss']
        })
    ], ProcessFiltersComponent);
    return ProcessFiltersComponent;
}());
exports.ProcessFiltersComponent = ProcessFiltersComponent;
