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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { UserProcessModel } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { PeopleListComponent } from './people-list.component';
import { PeopleSearchComponent } from './people-search.component';

const fakeUser: UserProcessModel = new UserProcessModel({
    id: '1',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeSecondUser: UserProcessModel = new UserProcessModel({
    id: '2',
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
});

describe('PeopleSearchComponent', () => {

    let peopleSearchComponent: PeopleSearchComponent;
    let fixture: ComponentFixture<PeopleSearchComponent>;
    let element: HTMLElement;
    let userArray = [fakeUser, fakeSecondUser];
    let searchInput: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatInputModule
            ],
            declarations: [
                PeopleSearchComponent,
                PeopleListComponent
            ],
            providers: [
            ]
        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(PeopleSearchComponent);
            peopleSearchComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            peopleSearchComponent.results = Observable.of([]);
            fixture.detectChanges();
        });
    }));

    it('should show input search text', () => {
        expect(element.querySelector('#userSearchText')).toBeDefined();
        expect(element.querySelector('#userSearchText')).not.toBeNull();
    });

    it('should hide people-list container', () => {
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                expect(element.querySelector('#search-people-list')).toBeNull();
            });

    });

    it('should show user which can be involved ', (done) => {
        peopleSearchComponent.searchPeople.subscribe(() => {
            peopleSearchComponent.results = Observable.of(userArray);
            peopleSearchComponent.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    let gatewayElement: any = element.querySelector('#search-people-list tbody');
                    expect(gatewayElement).not.toBeNull();
                    expect(gatewayElement.children.length).toBe(2);
                    done();
                });
        });
        searchInput = element.querySelector('#userSearchText');
        searchInput.value = 'fake-search';
        peopleSearchComponent.searchUser.markAsDirty();
        searchInput.dispatchEvent(new Event('input'));
    });

    it('should send an event when an user is clicked', (done) => {
        peopleSearchComponent.success.subscribe((user) => {
            expect(user).toBeDefined();
            expect(user.firstName).toBe('fake-name');
            done();
        });
        peopleSearchComponent.results = Observable.of(userArray);
        peopleSearchComponent.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                peopleSearchComponent.onRowClick(fakeUser);
                let addUserButton = <HTMLElement> element.querySelector('#add-people');
                addUserButton.click();
            });
    });

    it('should remove clicked user', (done) => {
        peopleSearchComponent.results = Observable.of(userArray);
        peopleSearchComponent.ngOnInit();
        fixture.detectChanges();
        peopleSearchComponent.onRowClick(fakeUser);
        let addUserButton = <HTMLElement> element.querySelector('#add-people');
        addUserButton.click();

        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                let gatewayElement: any = element.querySelector('#search-people-list tbody');
                expect(gatewayElement).not.toBeNull();
                expect(gatewayElement.children.length).toBe(1);
                done();
            });
    });
});
