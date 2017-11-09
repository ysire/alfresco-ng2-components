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
var JSON_FORMAT = 'json';
var PDF_FORMAT = 'pdf';
var ProcessAuditDirective = (function () {
    /**
     *
     * @param translateService
     * @param processListService
     */
    function ProcessAuditDirective(contentService, processListService) {
        this.contentService = contentService;
        this.processListService = processListService;
        this.fileName = 'Audit';
        this.format = 'pdf';
        this.download = true;
        this.clicked = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
    }
    ProcessAuditDirective.prototype.ngOnChanges = function (changes) {
        if (!this.isValidType()) {
            this.setDefaultFormatType();
        }
    };
    ProcessAuditDirective.prototype.isValidType = function () {
        if (this.format && (this.isJsonFormat() || this.isPdfFormat())) {
            return true;
        }
        return false;
    };
    ProcessAuditDirective.prototype.setDefaultFormatType = function () {
        this.format = PDF_FORMAT;
    };
    /**
     * fetch the audit information in the requested format
     */
    ProcessAuditDirective.prototype.fetchAuditInfo = function () {
        var _this = this;
        if (this.isPdfFormat()) {
            this.processListService.fetchProcessAuditPdfById(this.processId).subscribe(function (blob) {
                _this.audit = blob;
                if (_this.download) {
                    _this.contentService.downloadBlob(_this.audit, _this.fileName + '.pdf');
                }
                _this.clicked.emit({ format: _this.format, value: _this.audit, fileName: _this.fileName });
            }, function (err) {
                _this.error.emit(err);
            });
        }
        else {
            this.processListService.fetchProcessAuditJsonById(this.processId).subscribe(function (res) {
                _this.audit = res;
                _this.clicked.emit({ format: _this.format, value: _this.audit, fileName: _this.fileName });
            }, function (err) {
                _this.error.emit(err);
            });
        }
    };
    ProcessAuditDirective.prototype.onClickAudit = function () {
        this.fetchAuditInfo();
    };
    ProcessAuditDirective.prototype.isJsonFormat = function () {
        return this.format === JSON_FORMAT;
    };
    ProcessAuditDirective.prototype.isPdfFormat = function () {
        return this.format === PDF_FORMAT;
    };
    __decorate([
        core_1.Input('process-id')
    ], ProcessAuditDirective.prototype, "processId", void 0);
    __decorate([
        core_1.Input()
    ], ProcessAuditDirective.prototype, "fileName", void 0);
    __decorate([
        core_1.Input()
    ], ProcessAuditDirective.prototype, "format", void 0);
    __decorate([
        core_1.Input()
    ], ProcessAuditDirective.prototype, "download", void 0);
    __decorate([
        core_1.Output()
    ], ProcessAuditDirective.prototype, "clicked", void 0);
    __decorate([
        core_1.Output()
    ], ProcessAuditDirective.prototype, "error", void 0);
    ProcessAuditDirective = __decorate([
        core_1.Directive({
            selector: 'button[adf-process-audit]',
            host: {
                'role': 'button',
                '(click)': 'onClickAudit()'
            }
        })
    ], ProcessAuditDirective);
    return ProcessAuditDirective;
}());
exports.ProcessAuditDirective = ProcessAuditDirective;
