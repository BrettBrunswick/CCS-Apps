import { Component, OnInit } from '@angular/core';
import * as particlesJS from 'particles.js';

declare var particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { 

    particlesJS.load('particles-js', '../../assets/particles.json', function() {
      console.log('particles.json loaded...');
    });
    
  }

  ngOnInit() {
  }

}
