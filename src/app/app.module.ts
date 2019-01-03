import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { AccountComponent } from './components/account/account.component';
import { SearchSubsComponent } from './components/search-subs/search-subs.component';
import { LoginSpinnerComponent } from './components/ui/login-spinner/login-spinner.component';
import { DataSpinnerComponent } from './components/ui/data-spinner/data-spinner.component';
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
    AdminComponent,
    AccountComponent,
    SearchSubsComponent,
    LoginSpinnerComponent,
    DataSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    FontAwesomeModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true    
    })
  ],
  providers: [
    AuthGuard, 
    UserService, 
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
