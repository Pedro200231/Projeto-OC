import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerComponent } from './logger/logger.component';
import { ReportsComponent } from './reports/reports.component';
import { UserslistComponent} from './reports/userslist/userslist.component';
import { RegisterloginComponent } from './login/registerlogin/registerlogin.component';
import { FormDebugComponent } from './shared/form-debug/form-debug.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './shared/layout/layout.component';
import { TableComponent } from './shared/table/table.component';
import { ModalComponent } from './shared/modals/infomodal/modal.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { DeletemodalComponent } from './shared/modals/deletemodal/deletemodal.component';
import { LogtableComponent } from './shared/table/logtable/logtable.component';
import { LogmodalComponent } from './shared/modals/logmodal/logmodal.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormComponent } from './register/register-form/register-form.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterloginComponent,
    RegisterComponent,
    LoggerComponent,
    ReportsComponent,
    UserslistComponent,
    FormDebugComponent,
    LayoutComponent,
    TableComponent,
    ModalComponent,
    SnackbarComponent,
    DeletemodalComponent,
    LogtableComponent,
    LogmodalComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
