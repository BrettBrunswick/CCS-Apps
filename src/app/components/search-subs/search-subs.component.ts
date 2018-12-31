import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DataTableDirective } from 'angular-datatables';
import { SubContractor } from 'src/app/models/SubContractor';
import { Contact } from 'src/app/models/Contact';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-subs',
  templateUrl: './search-subs.component.html',
  styleUrls: ['./search-subs.component.css']
})
export class SearchSubsComponent implements OnInit {

  subContractors: SubContractor[];  

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<SubContractor[]> = new Subject();
  dtElement: DataTableDirective;

  faPlus = faPlus;

  constructor(private dataService: DataService) { }

  ngOnInit() 
  {
    this.initializeData();    
    this.dtOptions = {
      columnDefs: [{
        targets:[4],
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
    this.dataService.getAllSubs()
        .subscribe(data => {
          this.subContractors = data
          this.dtTrigger.next()
        });
    console.log(this.subContractors);
  }


}
