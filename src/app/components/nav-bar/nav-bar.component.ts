import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { faUser } from  '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  faUser = faUser;

  constructor(private userService: UserService) { }

  ngOnInit() {
    
  }

}
