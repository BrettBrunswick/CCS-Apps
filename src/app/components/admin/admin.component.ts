import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/User';
import { NewUser } from 'src/app/models/NewUser';
import { DataService } from 'src/app/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { faTrashAlt, faPencilAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { EditUser } from 'src/app/models/EditUser';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  allUsers: User[];
  userToDelete: string;
  editUserInitialIsAdminValue: boolean;
  showSpinner: boolean;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User[]> = new Subject();
  dtElement: DataTableDirective;

  closeResult: string;
  faTrashAlt = faTrashAlt;
  faPencilAlt = faPencilAlt;
  faQuestionCircle = faQuestionCircle;

  constructor(private dataService: DataService, private modalService: NgbModal ) { }

  newUser: NewUser = new NewUser();
  editUser: EditUser = new EditUser();

  ngOnInit() 
  {
    this.initializeData();
    this.dtOptions = {
      columnDefs: [{
        targets:[3],
        orderable: false
      }]
    };
  }

  ngOnDestroy(): void 
  {
    this.dtTrigger.unsubscribe();
  }

  initializeData(): void
  {
    this.showSpinner = true;
    this.dataService.getAllUsers()
        .subscribe(data => {
          this.showSpinner = false;
          this.allUsers = data
          this.dtTrigger.next()
        });
    this.resetNewUserForm();
    this.resetUserToDeleteAndEdit();
  }

  resetUserToDeleteAndEdit(): void
  {
    this.userToDelete = '';
    this.resetEditUserForm();
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
        IsAdmin: false
      }
    }
  }

  resetEditUserForm(form?: NgForm) 
  {
    this.editUserInitialIsAdminValue = false;
    if (form != null)
    {
      form.reset();
      this.editUser = 
      {
        Username: '',
        NewPassword: '',
        IsAdmin: false
      }
    }
  }

  registerNewUser(form: NgForm) 
  {
    console.log(this.newUser);
    this.dataService.registerUser(form.value).subscribe(success => {
      if (success) 
      {
        alert('account created.');
      }
    }, (err : HttpErrorResponse) => 
    {
      alert('Invalid Username or Password.')
    });
  }

  editProfile(form: NgForm)
  {
    this.dataService.editUser(form.value).subscribe(success => {
      if (success) 
      {
        alert('account edited.');
      }
    }, (err : HttpErrorResponse) => 
    {
      alert('error')
    });
  }

  deleteProfile()
  {
    this.dataService.deleteUser(this.userToDelete).subscribe(success => {
      if (success) 
      {
        alert('account deleted.');
      }
    }, (err : HttpErrorResponse) => 
    {
      alert('error')
    });
  }

  isAdminHasChanged(isAdmin: boolean)
  {
    return !(this.editUserInitialIsAdminValue == isAdmin);
  }

  open(content) 
  {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => 
    {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => 
    {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openProfileDeletion(content, userName: string) 
  {
    this.userToDelete = userName;
    this.modalService.open(content);
  }

  openProfileEdit(content, userName: string, roles: string[]) 
  {
    this.editUser.IsAdmin = roles.length > 0 ? true : false;
    this.editUserInitialIsAdminValue = this.editUser.IsAdmin;
    this.editUser.Username = userName;
    this.modalService.open(content);
  }

  private getDismissReason(reason: any): string 
  {
    if (reason === ModalDismissReasons.ESC) 
    {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) 
    {
      return 'by clicking on a backdrop';
    } else 
    {
      return  `with: ${reason}`;
    }
  }

}
