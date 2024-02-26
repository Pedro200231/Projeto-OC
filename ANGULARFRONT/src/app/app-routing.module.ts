import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {RegisterComponent } from './register/register.component';
import { LoggerComponent } from './logger/logger.component';
import { ReportsComponent } from './reports/reports.component';
import { UserslistComponent } from './reports/userslist/userslist.component';
import { authGuard } from './shared/guards/auth.guard';
import { RegisterloginComponent } from './login/registerlogin/registerlogin.component';
import { loginGuard } from './shared/guards/login.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { RegisterFormComponent } from './register/register-form/register-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'registerlogin', component: RegisterloginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/new', component: RegisterFormComponent },
      { path: 'register/edit/:id', component: RegisterFormComponent },
      { path: 'logs', component: LoggerComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'userslist', component: UserslistComponent },
    ]
  },
  { path: '**', redirectTo: '/home' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
