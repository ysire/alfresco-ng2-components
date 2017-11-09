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
var node_metadata_model_1 = require("../models/node-metadata.model");
var NodeService = (function () {
    function NodeService(apiService) {
        this.apiService = apiService;
    }
    /**
     * Get All the metadata and the nodeType for a nodeId cleaned by the prefix
     * @param nodeId Node Id
     * @returns NodeMetadata
     */
    NodeService.prototype.getNodeMetadata = function (nodeId) {
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.getNodeInfo(nodeId)).map(this.cleanMetadataFromSemicolon);
    };
    /**
     * Create a new Node from form metadata
     * @param path path
     * @param nodeType node type
     * @param nameSpace namespace node
     * @param data data to store
     * @returns NodeMetadata
     */
    NodeService.prototype.createNodeMetadata = function (nodeType, nameSpace, data, path, name) {
        var properties = {};
        for (var key in data) {
            if (data[key]) {
                properties[nameSpace + ':' + key] = data[key];
            }
        }
        return this.createNode(name || this.generateUuid(), nodeType, properties, path);
    };
    /**
     * Create a new Node from form metadata
     * @param name path
     * @param nodeType node type
     * @param properties namespace node
     * @param path path
     * @returns NodeMetadata
     */
    NodeService.prototype.createNode = function (name, nodeType, properties, path) {
        var body = {
            name: name,
            nodeType: nodeType,
            properties: properties,
            relativePath: path
        };
        // TODO: requires update to alfresco-js-api typings
        var apiService = this.apiService.getInstance();
        return Rx_1.Observable.fromPromise(apiService.nodes.addNode('-root-', body, {}));
    };
    NodeService.prototype.generateUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    NodeService.prototype.cleanMetadataFromSemicolon = function (data) {
        var metadata = {};
        if (data && data.properties) {
            for (var key in data.properties) {
                if (key) {
                    if (key.indexOf(':') !== -1) {
                        metadata[key.split(':')[1]] = data.properties[key];
                    }
                    else {
                        metadata[key] = data.properties[key];
                    }
                }
            }
        }
        return new node_metadata_model_1.NodeMetadata(metadata, data.nodeType);
    };
    NodeService = __decorate([
        core_1.Injectable()
    ], NodeService);
    return NodeService;
}());
exports.NodeService = NodeService;
