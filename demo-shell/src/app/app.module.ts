import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppConfigService, CoreModule, TRANSLATION_PROVIDER, createTranslateLoader, LogService } from '@alfresco/adf-core';
import { AppComponent } from './app.component';
import { AdfModule } from './adf.module';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { AboutComponent } from './components/about/about.component';
import { FormComponent } from './components/form/form.component';
import { FormListComponent } from './components/form/form-list.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';

import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { FilesComponent } from './components/files/files.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { WebscriptComponent } from './components/webscript/webscript.component';
import { TagComponent } from './components/tag/tag.component';
import { SocialComponent } from './components/social/social.component';
import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';

import { ThemePickerModule } from './components/theme-picker/theme-picker';
import { DebugAppConfigService } from './services/debug-app-config.service';

import { routing } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskAttachmentsComponent } from './components/process-service/task-attachments.component';
import { ProcessAttachmentsComponent } from './components/process-service/process-attachments.component';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BrowserModule,
        routing,
        FormsModule,
        MaterialModule,
        ThemePickerModule,
        FlexLayoutModule,
        ChartsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, LogService]
            }
        }),
        CoreModule.forRoot(),
        AdfModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        SettingsComponent,
        AppLayoutComponent,
        HomeComponent,
        SearchBarComponent,
        SearchResultComponent,
        AboutComponent,
        ProcessServiceComponent,
        ShowDiagramComponent,
        FormViewerComponent,
        FormNodeViewerComponent,
        AppsViewComponent,
        DataTableComponent,
        FilesComponent,
        FileViewComponent,
        FormComponent,
        FormListComponent,
        WebscriptComponent,
        TagComponent,
        SocialComponent,
        CustomSourcesComponent,
        VersionManagerDialogAdapterComponent,
        TaskAttachmentsComponent,
        ProcessAttachmentsComponent,
        OverlayViewerComponent
    ],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        }
    ],
    entryComponents: [
        VersionManagerDialogAdapterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
