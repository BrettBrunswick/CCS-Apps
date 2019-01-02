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
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  allUsers: User[];
  userToDelete: string;
  editUserInitialIsAdminValue: boolean;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User[]> = new Subject();
  dtElement: DataTableDirective;

  showSpinner: boolean;
  closeResult: string;
  faTrashAlt = faTrashAlt;
  faPencilAlt = faPencilAlt;
  faQuestionCircle = faQuestionCircle;

  constructor(private dataService: DataService, private modalService: NgbModal, private toastr: ToastrService) { }

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
        this.toastr.success('New User successfully registered.', 'Success');
      }
    }, (err : HttpErrorResponse) => 
    {
      if (err.status == 400)
      {
        this.toastr.error('Registration failed. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('There was an error connecting to the database. Please Contact IT.', 'Error');
      }
    });
  }

  editProfile(form: NgForm)
  {
    this.dataService.editUser(form.value).subscribe(success => {
      if (success) 
      {
        this.toastr.success('Account successfully updated.', 'Success');
      }
    }, (err : HttpErrorResponse) => 
    {
      if (err.status == 400)
      {
        this.toastr.error('Account update failed. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('There was an error connecting to the database. Please Contact IT.', 'Error');
      }
    });
  }

  deleteProfile()
  {
    this.dataService.deleteUser(this.userToDelete).subscribe(success => {
      if (success) 
      {
        this.toastr.success('User successfully deleted.', 'Success');
      }
    }, (err : HttpErrorResponse) => 
    {
      if (err.status == 400)
      {
        this.toastr.error('User deletion failed. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('There was an error connecting to the database. Please Contact IT.', 'Error');
      }
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
