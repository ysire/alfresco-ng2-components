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

import { Component, Input, OnChanges, EventEmitter, SimpleChanges, Output } from '@angular/core';
import { TaskListService } from './../services/tasklist.service';
import { AlfrescoTranslationService, ContentService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-task-audit',
    templateUrl: './task-audit.component.html',
    styleUrls: ['./task-audit.component.css']
})
export class TaskAuditComponent implements OnChanges {

    @Input()
    taskId: string;

    @Input()
    fileName: string = 'Audit';

    @Input()
    format: string = 'pdf';

    @Input()
    download: boolean = true;

    @Input()
    icon: string = 'assignment_ind';

    @Output()
    clicked: EventEmitter<any> = new EventEmitter<any>();

    static JSON_FORMAT: string = 'LIST';
    static PDF_FORMAT: string = 'pdf';

    audit: any;

    /**
     *
     * @param translateService
     * @param taskListService
     */
    constructor(private translateService: AlfrescoTranslationService,
                private contentService: ContentService,
                private taskListService: TaskListService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.isValidType()) {
            this.setDefaultFormatType();
        }
        this.getAuditInfo();
    }

    isValidType() {
        if (this.format && (this.isJsonFormat() || this.isPdfFormat())) {
            return true;
        }
        return false;
    }

    setDefaultFormatType(): void {
        this.format = TaskAuditComponent.PDF_FORMAT;
    }

    /**
     * Get the audit information in the requested format
     */
    getAuditInfo(): void {
        if(this.isPdfFormat()) {
            this.taskListService.getTaskAuditPdf(this.taskId).subscribe(
            (blob: Blob) => {
                this.audit = blob;
            });
        } else {
            this.taskListService.getTaskAuditJson(this.taskId).subscribe(
            (res) => {
                this.audit = res;
            });
        }
    }

    clickAudit() {
        this.clicked.emit({format: this.format, value: this.audit, fileName: this.fileName});
        if (this.download) {
            this.contentService.downloadBlob(this.audit, this.fileName + '.pdf');
        }
    }

    isJsonFormat() {
        return this.format === TaskAuditComponent.JSON_FORMAT;
    }

    isPdfFormat() {
        return this.format === TaskAuditComponent.PDF_FORMAT;
    }

}
