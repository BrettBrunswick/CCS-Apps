import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/User';
import { NewUser } from 'src/app/models/NewUser';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public allUsers: User[];
  public allUserRoles: string[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User[]> = new Subject();

  closeResult: string;

  constructor(private dataService: DataService, private userService: UserService, private modalService: NgbModal ) { }

  newUser: NewUser = new NewUser();

  ngOnInit() {

    this.resetNewUserForm();

    this.dtOptions = {
      columnDefs: [{
        targets:[3],
        orderable: false
      }]
    };

    this.dataService.getAllUsers()
        .subscribe(data => {
          this.allUsers = data
          this.dtTrigger.next()
        });

    this.dataService.getAllUserRoles()
    .subscribe(data => {
      this.allUserRoles = data
    });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  resetNewUserForm(form?: NgForm) 
  {
    if (form != null)
    {
      form.reset();
      this.newUser = 
      {
        Username: '',
        Password: '',
        Email: '',
        FirstName: '',
        LastName: '',
        Roles: []
      }
    }
  }

  registerNewUser(form: NgForm) 
  {
    console.log(this.newUser);
    this.userService.registerUser(form.value).subscribe(success => {
      if (success) 
      {
        alert('account created.');
      }
    }, (err : HttpErrorResponse) => 
    {
      alert('Invalid Username or Password.')
    });
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
