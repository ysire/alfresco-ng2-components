'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('core-js/es6');
require('core-js/es6/reflect');
require('core-js/es7/reflect');
var pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';
require('pdfjs-dist/web/pdf_viewer.js');
global.CSS = undefined;
global.scrollTo = jest.fn();
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
require('jest-zone-patch');
require('./global-mocks');
require('./matchers');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
jasmine.createSpyObj = function (baseName, methodNames) {
    var spyObj = {};
    methodNames.forEach(function (methodName) {
        spyObj[methodName] = function () { };
        jest.spyOn(spyObj, methodName);
    });
    return spyObj;
};
var TestBed = require('@angular/core/testing').TestBed;
var browser = require('@angular/platform-browser-dynamic/testing');
var NoopAnimationsModule = require('@angular/platform-browser/animations').NoopAnimationsModule;
var FormsModule = require('@angular/forms').FormsModule;
var ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;
var HttpClient = require('@angular/common/http').HttpClient;
var HttpClientModule = require('@angular/common/http').HttpClientModule;
var TranslateModule = require('@ngx-translate/core').TranslateModule;
var TranslateLoader = require('@ngx-translate/core').TranslateLoader;
var DirectiveModule = require('./core/directives/directive.module').DirectiveModule;
var ContextMenuModule = require('./core/context-menu/context-menu.module').ContextMenuModule;
var PipeModule = require('./core/pipes/pipe.module').PipeModule;
var AppConfigModule = require('./core/app-config/app-config.module').AppConfigModule;
var LogService = require('./core/services/log.service').LogService;
var TranslateLoaderService = require('./core/services/translate-loader.service').TranslateLoaderService;
var ServicesModule = require('./core/services/service.module').ServiceModule;
var DataTableModule = require('./core/datatable/datatable.module').DataTableModule;
var DataColumnModule = require('./core/data-column/data-column.module').DataColumnModule;
var AppConfigService = require('@alfresco/adf-core').AppConfigService;
var AppConfigServiceMock = require('@alfresco/adf-core').AppConfigServiceMock;
TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
function createTranslateLoader(http, logService) {
    return new TranslateLoaderService(http, logService);
}
exports.createTranslateLoader = createTranslateLoader;
beforeEach(function () {
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
            { provide: AppConfigService, useClass: AppConfigServiceMock }
        ]
    });
});
afterEach(function () {
    TestBed.resetTestingModule();
});
