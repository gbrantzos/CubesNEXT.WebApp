import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AlertDialogComponent } from '@shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { WaitingDataComponent } from '@shared/components/waiting-data/waiting-data.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { MaterialModule } from '@shared/material.module';

@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    WaitingDataComponent,
    DynamicFormComponent,
    LoaderComponent,
    DynamicTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    NgxJsonViewerModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    WaitingDataComponent,
    DynamicFormComponent,
    DynamicTableComponent,
    LoaderComponent,
    NgxJsonViewerModule
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }