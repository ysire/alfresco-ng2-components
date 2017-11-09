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
var EcmModelService = (function () {
    function EcmModelService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    EcmModelService_1 = EcmModelService;
    EcmModelService.prototype.createEcmTypeForActivitiForm = function (formName, form) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.searchActivitiEcmModel().subscribe(function (model) {
                if (!model) {
                    _this.createActivitiEcmModel(formName, form).subscribe(function (typeForm) {
                        observer.next(typeForm);
                        observer.complete();
                    });
                }
                else {
                    _this.saveFomType(formName, form).subscribe(function (typeForm) {
                        observer.next(typeForm);
                        observer.complete();
                    });
                }
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.searchActivitiEcmModel = function () {
        return this.getEcmModels().map(function (ecmModels) {
            return ecmModels.list.entries.find(function (model) { return model.entry.name === EcmModelService_1.MODEL_NAME; });
        });
    };
    EcmModelService.prototype.createActivitiEcmModel = function (formName, form) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.createEcmModel(EcmModelService_1.MODEL_NAME, EcmModelService_1.MODEL_NAMESPACE).subscribe(function (model) {
                _this.logService.info('model created', model);
                _this.activeEcmModel(EcmModelService_1.MODEL_NAME).subscribe(function (modelActive) {
                    _this.logService.info('model active', modelActive);
                    _this.createEcmTypeWithProperties(formName, form).subscribe(function (typeCreated) {
                        observer.next(typeCreated);
                        observer.complete();
                    });
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.saveFomType = function (formName, form) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.searchEcmType(formName, EcmModelService_1.MODEL_NAME).subscribe(function (ecmType) {
                _this.logService.info('custom types', ecmType);
                if (!ecmType) {
                    _this.createEcmTypeWithProperties(formName, form).subscribe(function (typeCreated) {
                        observer.next(typeCreated);
                        observer.complete();
                    });
                }
                else {
                    observer.next(ecmType);
                    observer.complete();
                }
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.createEcmTypeWithProperties = function (formName, form) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.createEcmType(formName, EcmModelService_1.MODEL_NAME, EcmModelService_1.TYPE_MODEL).subscribe(function (typeCreated) {
                _this.logService.info('type Created', typeCreated);
                _this.addPropertyToAType(EcmModelService_1.MODEL_NAME, formName, form).subscribe(function (properyAdded) {
                    _this.logService.info('property Added', properyAdded);
                    observer.next(typeCreated);
                    observer.complete();
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.searchEcmType = function (typeName, modelName) {
        return this.getEcmType(modelName).map(function (customTypes) {
            return customTypes.list.entries.find(function (type) { return type.entry.prefixedName === typeName || type.entry.title === typeName; });
        });
    };
    EcmModelService.prototype.activeEcmModel = function (modelName) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.activateCustomModel(modelName))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.createEcmModel = function (modelName, nameSpace) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.createCustomModel('DRAFT', '', modelName, modelName, nameSpace))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.getEcmModels = function () {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.getAllCustomModel())
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.getEcmType = function (modelName) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.getAllCustomType(modelName))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.createEcmType = function (typeName, modelName, parentType) {
        var _this = this;
        var name = this.cleanNameType(typeName);
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.createCustomType(modelName, name, parentType, typeName, ''))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.addPropertyToAType = function (modelName, typeName, formFields) {
        var _this = this;
        var name = this.cleanNameType(typeName);
        var properties = [];
        if (formFields && formFields.values) {
            for (var key in formFields.values) {
                if (key) {
                    properties.push({
                        name: key,
                        title: key,
                        description: key,
                        dataType: 'd:text',
                        multiValued: false,
                        mandatory: false,
                        mandatoryEnforced: false
                    });
                }
            }
        }
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.customModelApi.addPropertyToType(modelName, name, properties))
            .map(this.toJson)
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmModelService.prototype.cleanNameType = function (name) {
        var cleanName = name;
        if (name.indexOf(':') !== -1) {
            cleanName = name.split(':')[1];
        }
        return cleanName.replace(/[^a-zA-Z ]/g, '');
    };
    EcmModelService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    EcmModelService.prototype.handleError = function (err) {
        this.logService.error(err);
    };
    EcmModelService.MODEL_NAMESPACE = 'activitiForms';
    EcmModelService.MODEL_NAME = 'activitiFormsModel';
    EcmModelService.TYPE_MODEL = 'cm:folder';
    EcmModelService = EcmModelService_1 = __decorate([
        core_1.Injectable()
    ], EcmModelService);
    return EcmModelService;
    var EcmModelService_1;
}());
exports.EcmModelService = EcmModelService;
