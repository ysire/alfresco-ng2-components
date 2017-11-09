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
var ProcessCommentsComponent = (function () {
    function ProcessCommentsComponent(commentProcessService) {
        var _this = this;
        this.commentProcessService = commentProcessService;
        this.readOnly = true;
        this.error = new core_1.EventEmitter();
        this.comments = [];
        this.beingAdded = false;
        this.comment$ = new Rx_1.Observable(function (observer) { return _this.commentObserver = observer; }).share();
        this.comment$.subscribe(function (comment) {
            _this.comments.push(comment);
        });
    }
    ProcessCommentsComponent.prototype.ngOnChanges = function (changes) {
        var processInstanceId = changes['processInstanceId'];
        if (processInstanceId) {
            if (processInstanceId.currentValue) {
                this.getProcessInstanceComments(processInstanceId.currentValue);
            }
            else {
                this.resetComments();
            }
        }
    };
    ProcessCommentsComponent.prototype.getProcessInstanceComments = function (processInstanceId) {
        var _this = this;
        this.resetComments();
        if (processInstanceId) {
            this.commentProcessService.getProcessInstanceComments(processInstanceId).subscribe(function (res) {
                res = res.sort(function (comment1, comment2) {
                    var date1 = new Date(comment1.created);
                    var date2 = new Date(comment2.created);
                    return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                });
                res.forEach(function (comment) {
                    _this.commentObserver.next(comment);
                });
            }, function (err) {
                _this.error.emit(err);
            });
        }
    };
    ProcessCommentsComponent.prototype.resetComments = function () {
        this.comments = [];
    };
    ProcessCommentsComponent.prototype.add = function () {
        var _this = this;
        if (this.message && this.message.trim() && !this.beingAdded) {
            this.beingAdded = true;
            this.commentProcessService.addProcessInstanceComment(this.processInstanceId, this.message)
                .subscribe(function (res) {
                _this.comments.unshift(res);
                _this.message = '';
                _this.beingAdded = false;
            }, function (err) {
                _this.error.emit(err);
                _this.beingAdded = false;
            });
        }
    };
    ProcessCommentsComponent.prototype.clear = function () {
        this.message = '';
    };
    ProcessCommentsComponent.prototype.isReadOnly = function () {
        return this.readOnly;
    };
    ProcessCommentsComponent.prototype.onError = function (error) {
        this.error.emit(error);
    };
    __decorate([
        core_1.Input()
    ], ProcessCommentsComponent.prototype, "processInstanceId", void 0);
    __decorate([
        core_1.Input()
    ], ProcessCommentsComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Output()
    ], ProcessCommentsComponent.prototype, "error", void 0);
    ProcessCommentsComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-instance-comments',
            templateUrl: './process-comments.component.html',
            styleUrls: ['./process-comments.component.css']
        })
    ], ProcessCommentsComponent);
    return ProcessCommentsComponent;
}());
exports.ProcessCommentsComponent = ProcessCommentsComponent;
