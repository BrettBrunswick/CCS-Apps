import { Component, OnInit } from '@angular/core';
import * as particlesJS from 'particles.js';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserLogin } from './UserLogin';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';

declare var particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { 

    particlesJS.load('particles-js', '../../assets/particles.json', function() {
      console.log('particles.json loaded...');
    });
    
  }

  loginCredentials: UserLogin = new UserLogin();

  ngOnInit() {
    console.log(this.userService.isUserLoggedIn().toString());
    if (this.userService.isUserLoggedIn())
    {
      this.router.navigate(['/']);
    }
    this.resetLoginForm();
  }

  resetLoginForm(form?: NgForm) 
  {
    if (form != null)
    {
      form.reset();
      this.loginCredentials = 
      {
        Username: '',
        Password: ''
      }
    }
  }

  onLogin(form: NgForm) 
  {
    this.userService.login(form.value).subscribe(success => {
      if (success) 
      {
        alert ("Welcome")
        this.router.navigate(['/']);
      }
    }, (err : HttpErrorResponse) => 
    {
      alert("Invalid Username or Password.")
    });
  }

}
