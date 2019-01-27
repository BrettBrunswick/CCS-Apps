import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { UserService } from '../../services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { SubContractor } from 'src/app/models/SubContractor';
import { SubContractorList } from 'src/app/models/SubContractorList';
import { SubContractorSearchRequest } from 'src/app/models/SubContractorSearchRequest';
import { Trade } from 'src/app/models/Trade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr'; 
import { faPlus, faInfoCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-subs',
  templateUrl: './search-subs.component.html',
  styleUrls: ['./search-subs.component.css']
})
export class SearchSubsComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  subContractors: SubContractor[];
  subContractorLists: SubContractorList[];
  trades: Trade[];
  states: string[];

  selectedSub: SubContractor;
  listsSelectedSubBelongsTo: SubContractorList[] = [];
  listIdToAddSubTo: number;

  newList: SubContractorList = new SubContractorList();
  listToDelete: SubContractorList;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<SubContractor[]> = new Subject();
  dtElement: DataTableDirective;

  dtOptionsLists: DataTables.Settings = {};
  dtTriggerLists: Subject<SubContractorList[]> = new Subject();
  dtElementLists: DataTableDirective;

  showSubSpinner: boolean;
  showListSpinner: boolean;
  showAddToListSpinner: boolean = true;
  faPlus = faPlus;
  faInfoCircle = faInfoCircle;
  faTrashAlt = faTrashAlt;

  constructor(private dataService: DataService, public userService: UserService, private modalService: NgbModal, private toastr: ToastrService) { }

  subContractorSearchRequest = new SubContractorSearchRequest();

  ngOnInit() 
  {
    this.initializeData();
    this.initializeTables(); 
  }

  ngOnDestroy(): void 
  {
    this.dtTrigger.unsubscribe();
    this.dtTriggerLists.unsubscribe();
  }

  initializeTables(): void
  {
    this.dtOptions = {
      columnDefs: [{
        targets:[4],
        orderable: false
      }]
    };
    this.dtOptionsLists = {
      columnDefs: [{
        targets:[4],
        orderable: false
      }]
    };
  }

  initializeData(): void
  {
    this.showSubSpinner = true;
    this.showListSpinner = true;

    this.resetSubContractorSearchForm();

    this.dataService.getAllSubs()
        .subscribe(data => {
          console.log(data)
          this.showSubSpinner = false;
          this.subContractors = data
          console.log(this.subContractors);
          this.dtTrigger.next()
        });

    this.dataService.getAllTrades()
        .subscribe(data => {
          this.trades = data
        });

      this.dataService.getAllStates()
        .subscribe(data => {
          this.states = data
        });

        this.dataService.getAllSubLists()
        .subscribe(data => {
          console.log(data)
          this.showListSpinner = false;
          this.subContractorLists = data
          this.dtTriggerLists.next()
        });
  }

  rerenderTable(): void 
  {
    this.showSubSpinner = true;
    this.subContractors.splice(0, this.subContractors.length);
    this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  rerenderListTable(): void 
  {
    this.showListSpinner = true;
    this.subContractorLists.splice(0, this.subContractorLists.length);
    this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  resetSubContractorSearchForm(form?: NgForm) 
  {
    if (form != null)
    {
      form.reset();
      this.subContractorSearchRequest = 
      {
        CompanyName: '',
        City: '',
        State: '',
        ZipCode: '',
        TradeIds: [],
        Radius: undefined
      }
    }
  }

  searchSubContractors(form?: NgForm)
  {
    console.log(form.value);
    this.rerenderTable();
    this.dataService.searchSubs(form.value)
      .subscribe(data => {
        this.showSubSpinner = false;
        this.subContractors = data;
        this.dtTrigger.next();
      });
  }

  openAddToList(content, selectedSub: SubContractor) 
  {
    this.showAddToListSpinner = true;
    console.log(selectedSub)
    this.listsSelectedSubBelongsTo = [];
    this.selectedSub = selectedSub;
    this.dataService.getAllSubListsBySub(this.selectedSub.id)
        .subscribe(data => {
          this.listsSelectedSubBelongsTo = data
          this.showAddToListSpinner = false;
        });
    this.modalService.open(content);
  }

  open(content)
  {
    this.modalService.open(content);
  }

  openListDeletion(content, list: SubContractorList)
  {
    this.listToDelete = list;
    this.modalService.open(content);
  }

  deleteList()
  {
    this.rerenderListTable();
    this.dataService.deleteSubList(this.listToDelete.id)
      .subscribe( () =>
        this.successfullyDeletedList(),
        (err) => this.toastr.error('Could not delete List. If this problem persists please contact IT.', 'Error')
      );
  }

  successfullyDeletedList()
  {
    this.toastr.success('List deleted!', 'Success')
    this.dataService.getAllSubLists()
      .subscribe(data => {
        this.showListSpinner = false;
        this.subContractorLists = data
        this.dtTriggerLists.next()
      });
  }

  isSubAlreadyInList(listId: any)
  {
    var ids = this.listsSelectedSubBelongsTo.map(ids => ids.id);
    return ids.includes(listId);
  }

  addSubToList(form: NgForm)
  {
    form.reset();
    this.dataService.addSubToList(this.listIdToAddSubTo, this.selectedSub.id).subscribe(success => {
      if (success) 
      {
        this.rerenderListTable();
        this.toastr.success('Sub added to list!', 'Success');
        this.dataService.getAllSubLists()
          .subscribe(data => {
            this.showListSpinner = false;
            this.subContractorLists = data
            this.dtTriggerLists.next()
          });
      }
    }, (err : HttpErrorResponse) => 
    {
      if (err.status == 400)
      {
        this.toastr.error('Could not add Sub to List. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('There was an error connecting to the database. Please Contact IT.', 'Error');
      }
    });
    this.listIdToAddSubTo = null;
  }

  createNewList(form: NgForm) 
  {
    this.rerenderListTable();
    this.dataService.createSubContractorList(form.value).subscribe(success => {
      if (success) 
      {
        this.dataService.getAllSubLists()
          .subscribe(data => {
            this.showListSpinner = false;
            this.subContractorLists = data
            this.dtTriggerLists.next()
          });
        this.toastr.success('List successfully created.', 'Success');
      }
    }, (err : HttpErrorResponse) => 
    {
      this.dataService.getAllSubLists()
          .subscribe(data => {
            this.showListSpinner = false;
            this.subContractorLists = data
            this.dtTriggerLists.next()
          });
      if (err.status == 400)
      {
        this.toastr.error('List creation failed. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('There was an error connecting to the database. Please Contact IT.', 'Error');
      }
    });
  }

  isRadiusRequired(): boolean
  {
    return !this.dataService.isBlankOrNull(this.subContractorSearchRequest.City) || !this.dataService.isBlankOrNull(this.subContractorSearchRequest.ZipCode);
  }

  isRadiusBlank(): boolean
  {
    return (this.subContractorSearchRequest.Radius == undefined || this.subContractorSearchRequest.Radius == null);
  }

  isRadiusValid(): boolean
  { 
    return (this.subContractorSearchRequest.Radius > 0 && this.subContractorSearchRequest.Radius < 101);
  }

  isStateRequired(): boolean
  {
    return !this.dataService.isBlankOrNull(this.subContractorSearchRequest.City);
  }

  isCityAndStateReadonly(): boolean
  {
    return !this.dataService.isBlankOrNull(this.subContractorSearchRequest.ZipCode);
  }

  isStateBlank(): boolean
  {
    return (this.dataService.isBlankOrNull(this.subContractorSearchRequest.State));
  }

  isZipDisabled(): boolean
  {
    return (!this.dataService.isBlankOrNull(this.subContractorSearchRequest.City) || !this.dataService.isBlankOrNull(this.subContractorSearchRequest.State));
  }

}
