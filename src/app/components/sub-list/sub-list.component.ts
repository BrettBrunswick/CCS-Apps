import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubContractor } from 'src/app/models/SubContractor';
import { SubContractorList } from 'src/app/models/SubContractorList';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
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

  subListId = +this.route.snapshot.paramMap.get('id');
  subList: SubContractorList = new SubContractorList();

  dtOptions: any = {};
  dtTrigger: Subject<SubContractor[]> = new Subject();
  dtElement: DataTableDirective;

  showSpinner: boolean = true;
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
          filename: 'test',
          className: 'btn-success',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
        },
        {
          extend: 'excel',
          filename: this.subList.Name,
          className: 'btn-success',
          title: this.subList.Name,
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

}
