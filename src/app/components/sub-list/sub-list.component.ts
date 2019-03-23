import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubContractor } from 'src/app/models/SubContractor';
import { SubContractorList } from 'src/app/models/SubContractorList';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 
import { faTrashAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.css']
})
export class SubListComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  subListId = +this.route.snapshot.paramMap.get('id');
  exportFileName = this.route.snapshot.paramMap.get('listName');
  subList: SubContractorList = new SubContractorList();

  subToRemove: SubContractor;

  dtOptions: any = {};
  dtTrigger: Subject<SubContractor[]> = new Subject();
  dtElement: DataTableDirective;

  showSpinner: boolean = true;
  deleteSpinner: boolean = false;
  faTrash = faTrashAlt;
  faInfoCircle = faInfoCircle;

  constructor(private dataService: DataService, private route: ActivatedRoute, 
    private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() 
  {
    this.getSubContractorList();
    this.dtOptions = {
      columnDefs: [
        { targets:[4], orderable: false },
        { targets:[2, 3, 4, 5, 6, 7, 8], visible: false },
      ],
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'csv',
          filename: this.exportFileName,
          className: 'btn-success',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
        },
        {
          extend: 'excel',
          filename: this.exportFileName,
          className: 'btn-success',
          title: null,
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
        },
        {
          text: 'To Procore',
          className: 'btn-warning disabled'        
        }
      ]
    };

  }

  ngOnDestroy(): void 
  {
    this.dtTrigger.unsubscribe();
  }

  rerenderTable(): void 
  {
    this.deleteSpinner = true;
    this.subList = new SubContractorList();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.dataService.getSubListById(this.subListId)
      .subscribe(data => {
        this.subList.id = data['id'];
        this.subList.Name = data['name'];
        this.subList.description = data['description'];
        this.subList.createdByUser = data['createdByUser']
        this.subList.SubContractors = data['subContractors'];
        this.deleteSpinner = false;
        this.dtTrigger.next()      
      });
  }

  getSubContractorList()
  {
    console.log(this.subListId);
    this.dataService.getSubListById(this.subListId)
      .subscribe(data => {
        console.log(data);
        this.subList.id = data['id'];
        this.subList.Name = data['name'];
        this.subList.description = data['description'];
        this.subList.createdByUser = data['createdByUser']
        this.subList.SubContractors = data['subContractors'];
        console.log(this.subList.SubContractors);
        this.showSpinner = false;
        this.dtTrigger.next()      
      });
  }

  openModal(content, sub) 
  {
    this.subToRemove = sub;
    this.modalService.open(content)
  }

  deleteSubFromList()
  {
    this.deleteSpinner = true;
    this.dataService.deleteSubFromList(this.subList.id, this.subToRemove.id).subscribe(success => {
      if (success) 
      {
        this.toastr.success('Sub successfully removed from list.', 'Success');
        this.showSpinner = false;
        this.rerenderTable();
      }
    }, (err : HttpErrorResponse) => 
    {
      this.deleteSpinner = false;
      if (err.status == 400)
      {
        this.toastr.error('Sub deletion failed. If this problem persists please contact IT.', 'Error');
      } 
      else 
      {
        this.toastr.error('Sub was an error connecting to the database. Please Contact IT.', 'Error');
      }
    });
  }

}
