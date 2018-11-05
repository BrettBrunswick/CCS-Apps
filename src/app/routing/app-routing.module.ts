import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate  } from '@angular/router';
import { LoginComponent } from '../components/login/login.component'
import { AuthGuard } from '../routing/auth.guard';
import { NotFoundComponent } from '../components/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
