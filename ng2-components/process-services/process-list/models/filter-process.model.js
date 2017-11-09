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
Object.defineProperty(exports, "__esModule", { value: true });
var FilterProcessRepresentationModel = (function () {
    function FilterProcessRepresentationModel(obj) {
        if (obj) {
            this.id = obj.id || null;
            this.appId = obj.appId || null;
            this.name = obj.name || null;
            this.recent = !!obj.recent;
            this.icon = obj.icon || null;
            this.filter = obj.filter || null;
            this.index = obj.index;
        }
    }
    FilterProcessRepresentationModel.prototype.hasFilter = function () {
        return !!this.filter;
    };
    return FilterProcessRepresentationModel;
}());
exports.FilterProcessRepresentationModel = FilterProcessRepresentationModel;
/**
 *
 * This object represent the parameters of a process filter.
 *
 *
 * @returns {ProcessFilterParamRepresentationModel} .
 */
var ProcessFilterParamRepresentationModel = (function () {
    function ProcessFilterParamRepresentationModel(obj) {
        this.processDefinitionId = obj.processDefinitionId || null;
        this.appDefinitionId = obj.appDefinitionId || null;
        this.state = obj.state || null;
        this.sort = obj.sort || null;
        this.page = obj.page || null;
        this.size = obj.size || null;
    }
    return ProcessFilterParamRepresentationModel;
}());
exports.ProcessFilterParamRepresentationModel = ProcessFilterParamRepresentationModel;
