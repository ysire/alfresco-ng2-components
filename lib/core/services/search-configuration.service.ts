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

import { Injectable, InjectionToken } from '@angular/core';
import { QueryBody } from 'alfresco-js-api';
import { SearchConfigurationInterface } from '../interface/search-configuration.interface';

export const SEARCH_CONFIGURATION = new InjectionToken<SearchConfigurationInterface>('search.configuration');

@Injectable()
export class DefaultSearchConfigurationService implements SearchConfigurationInterface {

    constructor() {
    }

    public generateQueryBody(searchTerm: string, maxResults: string, skipCount: string): QueryBody {
        let defaultQueryBody: QueryBody = {
            query: {
                query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                { query: "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                { query: 'NOT cm:creator:System' }]
        };

        return defaultQueryBody;
    }
}
