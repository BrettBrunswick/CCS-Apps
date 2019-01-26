import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { faUser } from  '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  faUser = faUser;

  currentUsername: string;

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
  }

  isUserLoggedIn(): boolean
  {
    return this.userService.isUserLoggedIn();
  }

  isActiveRoute(route: string): boolean
  {
    return this.router.url.includes(route);
  }

  logout(): void
  {
    this.userService.logout();
  }

}
