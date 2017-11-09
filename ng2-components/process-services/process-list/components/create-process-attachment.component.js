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
var CreateProcessAttachmentComponent = (function () {
    function CreateProcessAttachmentComponent(activitiContentService) {
        this.activitiContentService = activitiContentService;
        this.error = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
    }
    CreateProcessAttachmentComponent.prototype.ngOnChanges = function (changes) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.processInstanceId = changes['processInstanceId'].currentValue;
        }
    };
    CreateProcessAttachmentComponent.prototype.onFileUpload = function (event) {
        var _this = this;
        var filesList = event.detail.files.map(function (obj) { return obj.file; });
        for (var _i = 0, filesList_1 = filesList; _i < filesList_1.length; _i++) {
            var fileInfoObj = filesList_1[_i];
            var file = fileInfoObj;
            var opts = {
                isRelatedContent: true
            };
            this.activitiContentService.createProcessRelatedContent(this.processInstanceId, file, opts).subscribe(function (res) {
                _this.success.emit(res);
            }, function (err) {
                _this.error.emit(err);
            });
        }
    };
    __decorate([
        core_1.Input()
    ], CreateProcessAttachmentComponent.prototype, "processInstanceId", void 0);
    __decorate([
        core_1.Output()
    ], CreateProcessAttachmentComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], CreateProcessAttachmentComponent.prototype, "success", void 0);
    CreateProcessAttachmentComponent = __decorate([
        core_1.Component({
            selector: 'adf-create-process-attachment',
            styleUrls: ['./create-process-attachment.component.css'],
            templateUrl: './create-process-attachment.component.html'
        })
    ], CreateProcessAttachmentComponent);
    return CreateProcessAttachmentComponent;
}());
exports.CreateProcessAttachmentComponent = CreateProcessAttachmentComponent;
