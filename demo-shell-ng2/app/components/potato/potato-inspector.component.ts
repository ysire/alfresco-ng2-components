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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'project-potato-inspector',
    templateUrl: './potato-inspector.component.html',
    styleUrls: ['./potato-inspector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PotatoInspectorComponent implements OnChanges {

    @Output()
    changed: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Input()
    actualComponent: string;

    @Input()
    code: string = `[
    {
        "key": "$thumbnail",
        "type": "image",
        "srTitle": "ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL",
        "sortable": false
    },
    {
        "key": "name",
        "type": "text",
        "title": "ADF-DOCUMENT-LIST.LAYOUT.NAME",
        "cssClass": "full-width ellipsis-cell",
        "sortable": true
    },
    {
        "key": "content.sizeInBytes",
        "type": "fileSize",
        "title": "ADF-DOCUMENT-LIST.LAYOUT.SIZE",
        "sortable": true
    },
    {
        "key": "modifiedAt",
        "type": "date",
        "title": "ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_ON",
        "format": "timeAgo",
        "sortable": true
    },
    {
        "key": "modifiedByUser.displayName",
        "type": "text",
        "title": "ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_BY",
        "sortable": true
    }
]`;

    config = {
        lineNumbers: true,
        mode: {
            name: 'javascript',
            json: true
        },
        theme: 'solarized dark'
    };

    showCode: boolean = false;

    onBlur() {
        this.changed.emit(JSON.parse(this.code));
    }

    ngOnChanges() {
        if (this.actualComponent === 'TagListComponent') {
        }

        if (this.actualComponent === 'DocumentListComponent') {
            this.showCode = true;
        }
    }
}
