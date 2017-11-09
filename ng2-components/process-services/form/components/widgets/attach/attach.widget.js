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
/* tslint:disable:component-selector  */
var core_1 = require("@angular/core");
var widget_component_1 = require("./../widget.component");
var AttachWidgetComponent = (function (_super) {
    __extends(AttachWidgetComponent, _super);
    function AttachWidgetComponent(formService, contentService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.contentService = contentService;
        _this.fieldChanged = new core_1.EventEmitter();
        _this.error = new core_1.EventEmitter();
        return _this;
    }
    AttachWidgetComponent.prototype.ngOnInit = function () {
        if (this.field) {
            var params = this.field.params;
            if (params &&
                params.fileSource &&
                params.fileSource.selectedFolder) {
                this.selectedFolderSiteId = params.fileSource.selectedFolder.siteId;
                this.selectedFolderSiteName = params.fileSource.selectedFolder.site;
                this.setupFileBrowser();
                this.getExternalContentNodes();
            }
        }
    };
    AttachWidgetComponent.prototype.setupFileBrowser = function () {
        if (this.field) {
            var params = this.field.params;
            this.selectedFolderPathId = params.fileSource.selectedFolder.pathId;
            this.selectedFolderAccountId = params.fileSource.selectedFolder.accountId;
        }
    };
    AttachWidgetComponent.prototype.getLinkedFileName = function () {
        var result = this.fileName;
        if (this.selectedFile &&
            this.selectedFile.title) {
            result = this.selectedFile.title;
        }
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0 &&
            this.field.value[0].name) {
            result = this.field.value[0].name;
        }
        return result;
    };
    AttachWidgetComponent.prototype.getExternalContentNodes = function () {
        var _this = this;
        this.contentService.getAlfrescoNodes(this.selectedFolderAccountId, this.selectedFolderPathId)
            .subscribe(function (nodes) { return _this.selectedFolderNodes = nodes; }, function (err) {
            _this.error.emit(err);
        });
    };
    AttachWidgetComponent.prototype.selectFile = function (node, $event) {
        var _this = this;
        this.contentService.linkAlfrescoNode(this.selectedFolderAccountId, node, this.selectedFolderSiteId).subscribe(function (link) {
            _this.selectedFile = node;
            _this.field.value = [link];
            _this.field.json.value = [link];
            _this.closeDialog();
            _this.fieldChanged.emit(_this.field);
        });
    };
    AttachWidgetComponent.prototype.selectFolder = function (node, $event) {
        this.selectedFolderPathId = node.id;
        this.getExternalContentNodes();
    };
    AttachWidgetComponent.prototype.showDialog = function () {
        this.setupFileBrowser();
        this.getExternalContentNodes();
        if (this.dialog) {
            // todo: show dialog
            return true;
        }
        return false;
    };
    AttachWidgetComponent.prototype.closeDialog = function () {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    };
    AttachWidgetComponent.prototype.cancel = function () {
        this.closeDialog();
    };
    AttachWidgetComponent.prototype.reset = function () {
        this.field.value = null;
        this.field.json.value = null;
    };
    AttachWidgetComponent.prototype.hasFile = function () {
        return this.field && this.field.value;
    };
    __decorate([
        core_1.Output()
    ], AttachWidgetComponent.prototype, "fieldChanged", void 0);
    __decorate([
        core_1.Output()
    ], AttachWidgetComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild('dialog')
    ], AttachWidgetComponent.prototype, "dialog", void 0);
    AttachWidgetComponent = __decorate([
        core_1.Component({
            selector: 'attach-widget',
            templateUrl: './attach.widget.html',
            styleUrls: ['./attach.widget.css'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AttachWidgetComponent);
    return AttachWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.AttachWidgetComponent = AttachWidgetComponent;
