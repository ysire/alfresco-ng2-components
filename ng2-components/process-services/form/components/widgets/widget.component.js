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
/* tslint:disable:component-selector  */
var core_1 = require("@angular/core");
exports.baseHost = {
    '(click)': 'event($event)',
    '(blur)': 'event($event)',
    '(change)': 'event($event)',
    '(focus)': 'event($event)',
    '(focusin)': 'event($event)',
    '(focusout)': 'event($event)',
    '(input)': 'event($event)',
    '(invalid)': 'event($event)',
    '(select)': 'event($event)'
};
/**
 * Base widget component.
 */
var WidgetComponent = (function () {
    function WidgetComponent(formService) {
        this.formService = formService;
        this.readOnly = false;
        /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
        this.fieldChanged = new core_1.EventEmitter();
    }
    WidgetComponent_1 = WidgetComponent;
    WidgetComponent.prototype.hasField = function () {
        return this.field ? true : false;
    };
    // Note for developers:
    // returns <any> object to be able binding it to the <element reguired="required"> attribute
    WidgetComponent.prototype.isRequired = function () {
        if (this.field && this.field.required) {
            return true;
        }
        return null;
    };
    WidgetComponent.prototype.isValid = function () {
        return this.field.validationSummary ? true : false;
    };
    WidgetComponent.prototype.hasValue = function () {
        return this.field &&
            this.field.value !== null &&
            this.field.value !== undefined;
    };
    WidgetComponent.prototype.isInvalidFieldRequired = function () {
        return !this.field.isValid && !this.field.validationSummary && this.isRequired();
    };
    WidgetComponent.prototype.ngAfterViewInit = function () {
        this.fieldChanged.emit(this.field);
    };
    /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
    WidgetComponent.prototype.checkVisibility = function (field) {
        this.fieldChanged.emit(field);
    };
    /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
    WidgetComponent.prototype.onFieldChanged = function (field) {
        this.fieldChanged.emit(field);
    };
    WidgetComponent.prototype.getHyperlinkUrl = function (field) {
        var url = WidgetComponent_1.DEFAULT_HYPERLINK_URL;
        if (field && field.hyperlinkUrl) {
            url = field.hyperlinkUrl;
            if (!/^https?:\/\//i.test(url)) {
                url = "" + WidgetComponent_1.DEFAULT_HYPERLINK_SCHEME + url;
            }
        }
        return url;
    };
    WidgetComponent.prototype.getHyperlinkText = function (field) {
        if (field) {
            return field.displayText || field.hyperlinkUrl;
        }
        return null;
    };
    WidgetComponent.prototype.event = function (event) {
        this.formService.formEvents.next(event);
    };
    WidgetComponent.DEFAULT_HYPERLINK_URL = '#';
    WidgetComponent.DEFAULT_HYPERLINK_SCHEME = 'http://';
    __decorate([
        core_1.Input()
    ], WidgetComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input()
    ], WidgetComponent.prototype, "field", void 0);
    __decorate([
        core_1.Output()
    ], WidgetComponent.prototype, "fieldChanged", void 0);
    WidgetComponent = WidgetComponent_1 = __decorate([
        core_1.Component({
            selector: 'base-widget',
            template: '',
            host: exports.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WidgetComponent);
    return WidgetComponent;
    var WidgetComponent_1;
}());
exports.WidgetComponent = WidgetComponent;
