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
var content_link_model_1 = require("../core/content-link.model");
var ContentWidgetComponent = (function () {
    function ContentWidgetComponent(formService, logService, contentService, processContentService) {
        this.formService = formService;
        this.logService = logService;
        this.contentService = contentService;
        this.processContentService = processContentService;
        this.showDocumentContent = true;
        this.contentClick = new core_1.EventEmitter();
        this.thumbnailLoaded = new core_1.EventEmitter();
        this.contentLoaded = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
    }
    ContentWidgetComponent.prototype.ngOnChanges = function (changes) {
        var contentId = changes['id'];
        if (contentId && contentId.currentValue) {
            this.loadContent(contentId.currentValue);
        }
    };
    ContentWidgetComponent.prototype.loadContent = function (id) {
        var _this = this;
        this.processContentService
            .getFileContent(id)
            .subscribe(function (response) {
            _this.content = new content_link_model_1.ContentLinkModel(response);
            _this.contentLoaded.emit(_this.content);
            _this.loadThumbnailUrl(_this.content);
        }, function (error) {
            _this.error.emit(error);
        });
    };
    ContentWidgetComponent.prototype.loadThumbnailUrl = function (content) {
        var _this = this;
        if (this.content.isThumbnailSupported()) {
            var observable = void 0;
            if (this.content.isTypeImage()) {
                observable = this.processContentService.getFileRawContent(content.id);
            }
            else {
                observable = this.processContentService.getContentThumbnailUrl(content.id);
            }
            if (observable) {
                observable.subscribe(function (response) {
                    _this.content.thumbnailUrl = _this.contentService.createTrustedUrl(response);
                    _this.thumbnailLoaded.emit(_this.content.thumbnailUrl);
                }, function (error) {
                    _this.error.emit(error);
                });
            }
        }
    };
    ContentWidgetComponent.prototype.openViewer = function (content) {
        var _this = this;
        this.processContentService.getFileRawContent(content.id).subscribe(function (blob) {
            content.contentBlob = blob;
            _this.contentClick.emit(content);
            _this.logService.info('Content clicked' + content.id);
            _this.formService.formContentClicked.next(content);
        }, function (error) {
            _this.error.emit(error);
        });
    };
    /**
     * Invoke content download.
     */
    ContentWidgetComponent.prototype.download = function (content) {
        var _this = this;
        this.processContentService.getFileRawContent(content.id).subscribe(function (blob) { return _this.contentService.downloadBlob(blob, content.name); }, function (error) {
            _this.error.emit(error);
        });
    };
    __decorate([
        core_1.Input()
    ], ContentWidgetComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input()
    ], ContentWidgetComponent.prototype, "showDocumentContent", void 0);
    __decorate([
        core_1.Output()
    ], ContentWidgetComponent.prototype, "contentClick", void 0);
    __decorate([
        core_1.Output()
    ], ContentWidgetComponent.prototype, "thumbnailLoaded", void 0);
    __decorate([
        core_1.Output()
    ], ContentWidgetComponent.prototype, "contentLoaded", void 0);
    __decorate([
        core_1.Output()
    ], ContentWidgetComponent.prototype, "error", void 0);
    ContentWidgetComponent = __decorate([
        core_1.Component({
            selector: 'adf-content',
            templateUrl: './content.widget.html',
            styleUrls: ['./content.widget.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContentWidgetComponent);
    return ContentWidgetComponent;
}());
exports.ContentWidgetComponent = ContentWidgetComponent;
