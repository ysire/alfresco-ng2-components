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
var http_1 = require("@angular/http");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var material_module_1 = require("./components/material.module");
var index_1 = require("./components/widgets/index");
var form_custom_button_directive_1 = require("./components/form-custom-button.directive");
var form_field_component_1 = require("./components/form-field/form-field.component");
var form_list_component_1 = require("./components/form-list.component");
var form_component_1 = require("./components/form.component");
var start_form_component_1 = require("./components/start-form.component");
var content_widget_1 = require("./components/widgets/content/content.widget");
var widget_component_1 = require("./components/widgets/widget.component");
var activiti_alfresco_service_1 = require("./services/activiti-alfresco.service");
var ecm_model_service_1 = require("./services/ecm-model.service");
var form_rendering_service_1 = require("./services/form-rendering.service");
var form_service_1 = require("./services/form.service");
var node_service_1 = require("./services/node.service");
var process_content_service_1 = require("./services/process-content.service");
var widget_visibility_service_1 = require("./services/widget-visibility.service");
var FormModule = (function () {
    function FormModule() {
    }
    FormModule = __decorate([
        core_1.NgModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                ng2_alfresco_datatable_1.DataTableModule,
                http_1.HttpModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                content_widget_1.ContentWidgetComponent,
                form_field_component_1.FormFieldComponent,
                form_component_1.FormComponent,
                form_list_component_1.FormListComponent,
                start_form_component_1.StartFormComponent,
                form_custom_button_directive_1.StartFormCustomButtonDirective
            ].concat(index_1.WIDGET_DIRECTIVES, index_1.MASK_DIRECTIVE, [
                widget_component_1.WidgetComponent
            ]),
            entryComponents: index_1.WIDGET_DIRECTIVES.slice(),
            providers: [
                activiti_alfresco_service_1.ActivitiAlfrescoContentService,
                ecm_model_service_1.EcmModelService,
                form_rendering_service_1.FormRenderingService,
                form_service_1.FormService,
                node_service_1.NodeService,
                process_content_service_1.ProcessContentService,
                widget_visibility_service_1.WidgetVisibilityService,
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: '@adf/process-services',
                        source: 'assets/ng2-activiti-form'
                    }
                }
            ],
            exports: [
                content_widget_1.ContentWidgetComponent,
                form_field_component_1.FormFieldComponent,
                form_component_1.FormComponent,
                form_list_component_1.FormListComponent,
                start_form_component_1.StartFormComponent,
                form_custom_button_directive_1.StartFormCustomButtonDirective
            ].concat(index_1.WIDGET_DIRECTIVES)
        })
    ], FormModule);
    return FormModule;
}());
exports.FormModule = FormModule;
