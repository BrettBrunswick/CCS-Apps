import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public allUsers: User[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User[]> = new Subject();
  closeResult: string;

  constructor(private dataService: DataService, private modalService: NgbModal) { }

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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
