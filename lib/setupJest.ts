'use strict';

require('core-js/es6');
require('core-js/es6/reflect');
require('core-js/es7/reflect');

var jasmineRequire = require('jasmine-core/lib/jasmine-core');

global.getJasmineRequireObj = () => {
    return jasmineRequire;
};

let pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';
require('pdfjs-dist/web/pdf_viewer.js');

global.CSS = undefined;
global.scrollTo = jest.fn()

// global.PDFJS = jest.fn()

//require('jasmine-core/lib/jasmine-core/jasmine-html');
//require('jasmine-core/lib/jasmine-core/boot');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
// require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('jasmine-ajax');
require('jest-zone-patch');
require('./global-mocks');
require('./matchers');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

jasmine.createSpyObj = (baseName: string, methodNames: any[]): any => {
    const spyObj = {};
    methodNames.forEach((methodName) => {
        spyObj[methodName] = () => {};
        jest.spyOn(spyObj, methodName);
    });

    return spyObj;
};
const TestBed = require('@angular/core/testing').TestBed;
const browser = require('@angular/platform-browser-dynamic/testing');
const NoopAnimationsModule = require('@angular/platform-browser/animations').NoopAnimationsModule;
const FormsModule = require('@angular/forms').FormsModule;
const ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;
const HttpClient = require('@angular/common/http').HttpClient;
const HttpClientModule = require('@angular/common/http').HttpClientModule;
const TranslateModule = require('@ngx-translate/core').TranslateModule;
const TranslateLoader = require('@ngx-translate/core').TranslateLoader;

const DirectiveModule = require('./core/directives/directive.module').DirectiveModule;
const ContextMenuModule = require('./core/context-menu/context-menu.module').ContextMenuModule;
const PipeModule = require('./core/pipes/pipe.module').PipeModule;
const AppConfigModule = require('./core/app-config/app-config.module').AppConfigModule;
const LogService = require('./core/services/log.service').LogService;
const TranslateLoaderService = require('./core/services/translate-loader.service').TranslateLoaderService;
const ServicesModule = require('./core/services/service.module').ServiceModule;
const DataTableModule = require('./core/datatable/datatable.module').DataTableModule;
const DataColumnModule = require('./core/data-column/data-column.module').DataColumnModule;

const AppConfigService = require('@alfresco/adf-core').AppConfigService;
const AppConfigServiceMock = require('@alfresco/adf-core').AppConfigServiceMock;

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

export function createTranslateLoader(http, logService) {
    return new TranslateLoaderService(http, logService);
}

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            ServicesModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient, LogService]
                }
            }),
            DirectiveModule,
            ContextMenuModule,
            PipeModule,
            AppConfigModule,
            NoopAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            HttpClientModule,
            DataTableModule,
            DataColumnModule
        ],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock}
        ]});
});

afterEach(() => {
    TestBed.resetTestingModule();
});
