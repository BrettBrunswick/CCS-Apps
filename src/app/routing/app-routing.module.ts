import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate  } from '@angular/router';
import { LoginComponent } from '../components/login/login.component'
import { AuthGuard } from '../routing/auth.guard';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { AdminComponent } from '../components/admin/admin.component';
import { AccountComponent } from '../components/account/account.component';
import { SearchSubsComponent } from '../components/search-subs/search-subs.component';
import { SubsComponent } from '../components/subs/subs.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'subs', component: SearchSubsComponent, canActivate: [AuthGuard] },
  { path: 'subs/:id', component: SubsComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
