import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AuthGuard } from './routing/auth.guard';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    NotFoundComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: [
    AuthGuard, 
    UserService, 
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
