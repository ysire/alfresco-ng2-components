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

import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

    isEnabled(): boolean {
        // for certain scenarios Chrome may say 'true' but have cookies still disabled
        if (navigator.cookieEnabled === false) {
            return false;
        }

        document.cookie = 'test-cookie';
        return document.cookie.indexOf('test-cookie') > 0;
    }

    /**
     * Retrieve cookie by key.
     *
     * @returns {string | null}
     */
    getItem(key: string): string | null {
        const regexp = new RegExp('(?:' + key + '|;\s*' + key + ')=(.*?)(?:;|$)', 'g');
        const result = regexp.exec(document.cookie);
        return (result === null) ? null : result[1];
    }

    /**
     * Set a cookie.
     * @param key
     * @param data
     * @param expiration
     * @param path
     *
     * @returns {boolean}
     */
    setItem(key: string, data: string, expiration: Date | null, path: string | null): void {
        document.cookie = `${key}=${data}` +
            (expiration ? ';expires=' + expiration.toUTCString() : '') +
            (path ? `;path=${path}` : ';path=/');
    }
}
