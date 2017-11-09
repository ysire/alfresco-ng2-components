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
var flex_layout_1 = require("@angular/flex-layout");
var material_1 = require("@angular/material");
var process_services_1 = require("@adf/process-services");
var ng2_activiti_tasklist_1 = require("ng2-activiti-tasklist");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var create_process_attachment_component_1 = require("./components/create-process-attachment.component");
var process_attachment_list_component_1 = require("./components/process-attachment-list.component");
var process_audit_directive_1 = require("./components/process-audit.directive");
var process_comments_component_1 = require("./components/process-comments.component");
var process_filters_component_1 = require("./components/process-filters.component");
var process_instance_details_component_1 = require("./components/process-instance-details.component");
var process_instance_header_component_1 = require("./components/process-instance-header.component");
var process_instance_tasks_component_1 = require("./components/process-instance-tasks.component");
var process_list_component_1 = require("./components/process-list.component");
var start_process_component_1 = require("./components/start-process.component");
var process_upload_service_1 = require("./services/process-upload.service");
var process_service_1 = require("./services/process.service");
exports.ACTIVITI_PROCESSLIST_DIRECTIVES = [
    process_list_component_1.ProcessInstanceListComponent,
    process_filters_component_1.ProcessFiltersComponent,
    process_instance_details_component_1.ProcessInstanceDetailsComponent,
    process_audit_directive_1.ProcessAuditDirective,
    process_instance_header_component_1.ProcessInstanceHeaderComponent,
    process_instance_tasks_component_1.ProcessInstanceTasksComponent,
    process_comments_component_1.ProcessCommentsComponent,
    start_process_component_1.StartProcessInstanceComponent,
    process_attachment_list_component_1.ProcessAttachmentListComponent,
    create_process_attachment_component_1.CreateProcessAttachmentComponent,
];
exports.ACTIVITI_PROCESSLIST_PROVIDERS = [
    process_service_1.ProcessService,
    process_upload_service_1.ProcessUploadService,
    ng2_alfresco_core_1.CardViewUpdateService,
];
var ProcessListModule = (function () {
    function ProcessListModule() {
    }
    ProcessListModule = __decorate([
        core_1.NgModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                ng2_alfresco_datatable_1.DataTableModule,
                process_services_1.FormModule,
                ng2_activiti_tasklist_1.ActivitiTaskListModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatButtonModule,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatChipsModule,
                material_1.MatSelectModule,
                flex_layout_1.FlexLayoutModule
            ],
            declarations: exports.ACTIVITI_PROCESSLIST_DIRECTIVES.slice(),
            providers: exports.ACTIVITI_PROCESSLIST_PROVIDERS.concat([
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'ng2-activiti-processlist',
                        source: 'assets/ng2-activiti-processlist'
                    }
                }
            ]),
            exports: exports.ACTIVITI_PROCESSLIST_DIRECTIVES.slice()
        })
    ], ProcessListModule);
    return ProcessListModule;
}());
exports.ProcessListModule = ProcessListModule;
