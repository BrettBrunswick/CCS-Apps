import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private dataService: DataService) { }
  user: User = new User();

  ngOnInit() 
  {
    this.getUserData();
  }

  getUserData()
  {
    this.dataService.getUserByUsername(localStorage.getItem("username"))
        .subscribe(data => {
          this.user.Username = data["userName"],
          this.user.FirstName = data["firstName"],
          this.user.LastName = data["lastName"],
          this.user.Roles = data["roles"]
        });
  }

}
