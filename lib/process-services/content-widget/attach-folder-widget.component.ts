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

 /* tslint:disable:component-selector:no-console */

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    baseHost,
    WidgetComponent,
    FormService
} from '@alfresco/adf-core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
// import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'attach-folder-widget',
    templateUrl: './attach-folder-widget.component.html',
    styleUrls: ['./attach-folder-widget.component.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class AttachFolderWidgetComponent extends WidgetComponent implements OnInit {

    constructor(private contentDialog: ContentNodeDialogService,
                public formService: FormService){
        super();
    };

    hasFolder: boolean ;

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFolder = true;
        }
    }

    isDefinedSourceFolder() {
        return !!this.field.params &&
               !!this.field.params.folderSource &&
               !!this.field.params.folderSource.selectedFolder;
    }

    openSelectDialogFromFileSource() {
        let params = this.field.params;
        if (this.isDefinedSourceFolder()) {
            this.contentDialog.openFileBrowseDialogByFolderId(params.folderSource.selectedFolder.pathId).subscribe(
                (selections: MinimalNodeEntryEntity[]) => {
                    //this.attachFolder
                });
        }
    }

}
