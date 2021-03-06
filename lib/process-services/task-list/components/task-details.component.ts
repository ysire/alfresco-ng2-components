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

import { PeopleProcessService, UserProcessModel } from '@alfresco/adf-core';
import { AuthenticationService, CardViewUpdateService, ClickNotification, LogService, UpdateNotification, FormRenderingService } from '@alfresco/adf-core';
import { Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ContentLinkModel, FormFieldValidator, FormModel, FormOutcomeEvent } from '@alfresco/adf-core';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { CommentsComponent } from '../../comments';
import { AttachFileWidgetComponent, AttachFolderWidgetComponent } from '../../content-widget';

@Component({
    selector: 'adf-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    providers: [
        CardViewUpdateService
    ]
})
export class TaskDetailsComponent implements OnInit, OnChanges {

    @ViewChild('activiticomments')
    activiticomments: CommentsComponent;

    @ViewChild('activitichecklist')
    activitichecklist: any;

    @ViewChild('errorDialog')
    errorDialog: TemplateRef<any>;

    @Input()
    debugMode: boolean = false;

    @Input()
    taskId: string;

    @Input()
    showNextTask: boolean = true;

    @Input()
    showHeader: boolean = true;

    @Input()
    showHeaderContent: boolean = true;

    @Input()
    showInvolvePeople: boolean = true;

    @Input()
    showComments: boolean = true;

    @Input()
    showChecklist: boolean = true;

    @Input()
    showFormTitle: boolean = true;

    @Input()
    showFormCompleteButton: boolean = true;

    @Input()
    showFormSaveButton: boolean = true;

    @Input()
    readOnlyForm: boolean = false;

    @Input()
    showFormRefreshButton: boolean = true;

    @Input()
    fieldValidators: FormFieldValidator[] = [];

    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    taskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    @Output()
    taskDeleted: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    @Output()
    assignTask: EventEmitter<void> = new EventEmitter<void>();

    taskDetails: TaskDetailsModel;
    taskFormName: string = null;

    taskPeople: UserProcessModel[] = [];

    noTaskDetailsTemplateComponent: TemplateRef<any>;

    showAssignee: boolean = false;

    private peopleSearchObserver: Observer<UserProcessModel[]>;
    public errorDialogRef: MatDialogRef<TemplateRef<any>>;

    peopleSearch$: Observable<UserProcessModel[]>;

    constructor(private taskListService: TaskListService,
                private authService: AuthenticationService,
                private peopleProcessService: PeopleProcessService,
                private formRenderingService: FormRenderingService,
                private logService: LogService,
                private cardViewUpdateService: CardViewUpdateService,
                private dialog: MatDialog) {

        this.formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        this.peopleSearch$ = new Observable<UserProcessModel[]>(observer => this.peopleSearchObserver = observer).share();
    }

    ngOnInit() {
        if (this.taskId) {
            this.loadDetails(this.taskId);
        }

        this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this));
        this.cardViewUpdateService.itemClicked$.subscribe(this.clickTaskDetails.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        let taskId = changes.taskId;
        this.showAssignee = false;

        if (taskId && !taskId.currentValue) {
            this.reset();
        } else if (taskId && taskId.currentValue) {
            this.taskFormName = null;
            this.loadDetails(taskId.currentValue);
        }
    }

    /**
     * Reset the task details
     */
    private reset() {
        this.taskDetails = null;
    }

    /**
     * Check if the task has a form
     * @returns {TaskDetailsModel|string|boolean}
     */
    hasFormKey() {
        return (this.taskDetails
        && this.taskDetails.formKey
        && this.taskDetails.formKey !== 'null');
    }

    isTaskActive() {
        return this.taskDetails && this.taskDetails.duration === null;
    }

    /**
     * Save a task detail and update it after a successful response
     *
     * @param updateNotification
     */
    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.taskListService.updateTask(this.taskId, updateNotification.changed)
            .subscribe(
                () => {
                    this.loadDetails(this.taskId);
                }
            );
    }

    private clickTaskDetails(clickNotification: ClickNotification) {
        if (clickNotification.target.key === 'assignee') {
            this.showAssignee = true;
        }
    }

    /**
     * Load the activiti task details
     * @param taskId
     */
    private loadDetails(taskId: string) {
        this.taskPeople = [];
        this.readOnlyForm = false;

        if (taskId) {
            this.taskListService.getTaskDetails(taskId).subscribe(
                (res: TaskDetailsModel) => {
                    this.taskDetails = res;

                    if (this.taskDetails.name === 'null') {
                        this.taskDetails.name = 'No name';
                    }

                    let endDate: any = res.endDate;
                    this.readOnlyForm = this.readOnlyForm ? this.readOnlyForm : !!(endDate && !isNaN(endDate.getTime()));
                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new UserProcessModel(user));
                        });
                    }
                });
        }
    }

    isAssigned(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee.email === this.authService.getBpmUsername();
    }

    /**
     * Retrieve the next open task
     * @param processInstanceId
     * @param processDefinitionId
     */
    private loadNextTask(processInstanceId: string, processDefinitionId: string): void {
        let requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.taskListService.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = new TaskDetailsModel(response[0]);
                } else {
                    this.reset();
                }
            }, (error) => {
                this.error.emit(error);
            });
    }

    /**
     * Complete button clicked
     */
    onComplete(): void {
        this.taskListService.completeTask(this.taskId).subscribe(
            (res) => this.onFormCompleted(null)
        );
    }

    onFormContentClick(content: ContentLinkModel): void {
        this.formContentClicked.emit(content);
    }

    onFormSaved(form: FormModel): void {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel): void {
        this.formCompleted.emit(form);
        if (this.showNextTask && (this.taskDetails.processInstanceId || this.taskDetails.processDefinitionId)) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    onFormLoaded(form: FormModel): void {
        this.taskFormName = (form && form.name ? form.name : null);
        this.formLoaded.emit(form);
    }

    onChecklistTaskCreated(task: TaskDetailsModel): void {
        this.taskCreated.emit(task);
    }

    onChecklistTaskDeleted(taskId: string): void {
        this.taskDeleted.emit(taskId);
    }

    onFormError(error: any): void {
        this.errorDialogRef = this.dialog.open(this.errorDialog, {width: '500px'});
        this.error.emit(error);
    }

    onFormExecuteOutcome(event: FormOutcomeEvent): void {
        this.executeOutcome.emit(event);
    }

    closeErrorDialog(): void {
        this.dialog.closeAll();
    }

    onClaimAction(taskId: string): void {
        this.loadDetails(taskId);
    }

    toggleHeaderContent(): void {
        this.showHeaderContent = !this.showHeaderContent;
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate ? true : undefined;
    }

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(null, searchedWord)
            .subscribe((users) => {
                users = users.filter((user) => user.id !== this.taskDetails.assignee.id);
                this.peopleSearchObserver.next(users);
            }, error => this.logService.error('Could not load users'));
    }

    onCloseSearch() {
        this.showAssignee = false;
    }

    assignTaskToUser(selectedUser: UserProcessModel) {
        this.taskListService.assignTask(this.taskDetails.id, selectedUser).subscribe(
            (res: any) => {
                this.logService.info('Task Assigned to ' + selectedUser.email);
                this.assignTask.emit();
            });
        this.showAssignee = false;
    }

    getTaskHeaderViewClass(): string {
        if (this.showAssignee) {
            return 'assign-edit-view';
        } else {
            return 'default-view';
        }
    }

    isReadOnlyComment(): boolean {
        return (this.taskDetails && this.taskDetails.isCompleted()) && (this.taskPeople && this.taskPeople.length === 0);
    }
}
