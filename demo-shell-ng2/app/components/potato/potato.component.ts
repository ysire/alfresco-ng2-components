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

import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DocumentListComponent } from 'ng2-alfresco-documentlist';
import { TagListComponent } from 'ng2-alfresco-tag';

@Component({
    selector: 'project-potato',
    templateUrl: './potato.component.html',
    styleUrls: ['./potato.component.scss']
})
export class PotatoComponent implements OnInit {

    @ViewChild('componentsContainer', { read: ViewContainerRef }) container;

    componentRef: ComponentRef<any>;

    componentName: string = '';

    constructor(private resolver: ComponentFactoryResolver) {}

    codeChanged(config) {
        console.log(config);
    }

    onComponentCreation(name) {
        this.componentName = name;

        if (name === 'TagListComponent') {
            const tagListComponent: ComponentFactory<any> = this.resolver.resolveComponentFactory(TagListComponent);
            this.componentRef = this.container.createComponent(tagListComponent);
        }

        if (name === 'DocumentListComponent') {
            const documentListComponent: ComponentFactory<any> = this.resolver.resolveComponentFactory(DocumentListComponent);
            this.componentRef = this.container.createComponent(documentListComponent);
            this.componentRef.instance.currentFolderId = '-my-';

            this.componentRef.instance.ngOnInit();
            this.componentRef.instance.ngOnChanges({ currentFolderId: { currentValue: '-my-' } });
        }
    }

    ngOnInit() {
        console.log(this.container);
    }
}
