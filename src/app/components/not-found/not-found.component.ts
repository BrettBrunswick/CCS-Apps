import { Component, OnInit } from '@angular/core';
import { faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  faHome = faHome;
  faEnvelope = faEnvelope;

  constructor(public location: Location) { }

  ngOnInit() {
  }
  

}
