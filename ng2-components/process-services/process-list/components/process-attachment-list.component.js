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
var ProcessAttachmentListComponent = (function () {
    function ProcessAttachmentListComponent(activitiContentService, contentService, thumbnailService, ngZone) {
        this.activitiContentService = activitiContentService;
        this.contentService = contentService;
        this.thumbnailService = thumbnailService;
        this.ngZone = ngZone;
        this.disabled = false;
        this.attachmentClick = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.emptyListImageUrl = require('./../assets/images/empty_doc_lib.svg');
        this.attachments = [];
        this.isLoading = true;
    }
    ProcessAttachmentListComponent.prototype.ngOnChanges = function (changes) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.loadAttachmentsByProcessInstanceId(changes['processInstanceId'].currentValue);
        }
    };
    ProcessAttachmentListComponent.prototype.reset = function () {
        this.attachments = [];
    };
    ProcessAttachmentListComponent.prototype.reload = function () {
        var _this = this;
        this.ngZone.run(function () {
            _this.loadAttachmentsByProcessInstanceId(_this.processInstanceId);
        });
    };
    ProcessAttachmentListComponent.prototype.add = function (content) {
        var _this = this;
        this.ngZone.run(function () {
            _this.attachments.push({
                id: content.id,
                name: content.name,
                created: content.created,
                createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                icon: _this.thumbnailService.getMimeTypeIcon(content.mimeType)
            });
        });
    };
    ProcessAttachmentListComponent.prototype.loadAttachmentsByProcessInstanceId = function (processInstanceId) {
        var _this = this;
        if (processInstanceId) {
            this.reset();
            this.isLoading = true;
            this.activitiContentService.getProcessRelatedContent(processInstanceId).subscribe(function (res) {
                res.data.forEach(function (content) {
                    _this.attachments.push({
                        id: content.id,
                        name: content.name,
                        created: content.created,
                        createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                        icon: _this.thumbnailService.getMimeTypeIcon(content.mimeType)
                    });
                });
                _this.success.emit(_this.attachments);
                _this.isLoading = false;
            }, function (err) {
                _this.error.emit(err);
                _this.isLoading = false;
            });
        }
    };
    ProcessAttachmentListComponent.prototype.deleteAttachmentById = function (contentId) {
        var _this = this;
        if (contentId) {
            this.activitiContentService.deleteRelatedContent(contentId).subscribe(function (res) {
                _this.attachments = _this.attachments.filter(function (content) {
                    return content.id !== contentId;
                });
            }, function (err) {
                _this.error.emit(err);
            });
        }
    };
    ProcessAttachmentListComponent.prototype.isEmpty = function () {
        return this.attachments && this.attachments.length === 0;
    };
    ProcessAttachmentListComponent.prototype.onShowRowActionsMenu = function (event) {
        var viewAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT',
            name: 'view'
        };
        var removeAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT',
            name: 'remove'
        };
        var downloadAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT',
            name: 'download'
        };
        event.value.actions = [
            viewAction,
            downloadAction
        ];
        if (!this.disabled) {
            event.value.actions.splice(1, 0, removeAction);
        }
    };
    ProcessAttachmentListComponent.prototype.onExecuteRowAction = function (event) {
        var args = event.value;
        var action = args.action;
        if (action.name === 'view') {
            this.emitDocumentContent(args.row.obj);
        }
        else if (action.name === 'remove') {
            this.deleteAttachmentById(args.row.obj.id);
        }
        else if (action.name === 'download') {
            this.downloadContent(args.row.obj);
        }
    };
    ProcessAttachmentListComponent.prototype.openContent = function (event) {
        var content = event.value.obj;
        this.emitDocumentContent(content);
    };
    ProcessAttachmentListComponent.prototype.emitDocumentContent = function (content) {
        var _this = this;
        this.activitiContentService.getFileRawContent(content.id).subscribe(function (blob) {
            content.contentBlob = blob;
            _this.attachmentClick.emit(content);
        }, function (err) {
            _this.error.emit(err);
        });
    };
    ProcessAttachmentListComponent.prototype.downloadContent = function (content) {
        var _this = this;
        this.activitiContentService.getFileRawContent(content.id).subscribe(function (blob) { return _this.contentService.downloadBlob(blob, content.name); }, function (err) {
            _this.error.emit(err);
        });
    };
    ProcessAttachmentListComponent.prototype.isDisabled = function () {
        return this.disabled;
    };
    __decorate([
        core_1.Input()
    ], ProcessAttachmentListComponent.prototype, "processInstanceId", void 0);
    __decorate([
        core_1.Input()
    ], ProcessAttachmentListComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Output()
    ], ProcessAttachmentListComponent.prototype, "attachmentClick", void 0);
    __decorate([
        core_1.Output()
    ], ProcessAttachmentListComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output()
    ], ProcessAttachmentListComponent.prototype, "error", void 0);
    __decorate([
        core_1.Input()
    ], ProcessAttachmentListComponent.prototype, "emptyListImageUrl", void 0);
    ProcessAttachmentListComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-attachment-list',
            styleUrls: ['./process-attachment-list.component.scss'],
            templateUrl: './process-attachment-list.component.html'
        })
    ], ProcessAttachmentListComponent);
    return ProcessAttachmentListComponent;
}());
exports.ProcessAttachmentListComponent = ProcessAttachmentListComponent;
