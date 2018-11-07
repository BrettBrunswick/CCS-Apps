import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public allUsers: User[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User[]> = new Subject();

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dtOptions = {
      columnDefs: [{
        targets:[2],
        orderable: false
      }]
    };

    this.dataService.getAllUsers()
        .subscribe(data => {
          this.allUsers = data
          this.dtTrigger.next()
        });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
