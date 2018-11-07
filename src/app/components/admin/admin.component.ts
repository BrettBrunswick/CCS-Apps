import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public allUsers: User[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAllUsers()
        .subscribe(data => this.allUsers = data);
  }

}
