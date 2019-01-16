import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DataTableDirective } from 'angular-datatables';
import { SubContractor } from 'src/app/models/SubContractor';
import { SubContractorSearchRequest } from 'src/app/models/SubContractorSearchRequest';
import { Trade } from 'src/app/models/Trade';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-subs',
  templateUrl: './search-subs.component.html',
  styleUrls: ['./search-subs.component.css']
})
export class SearchSubsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  subContractors: SubContractor[];
  trades: Trade[];
  states: string[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<SubContractor[]> = new Subject();
  dtElement: DataTableDirective;

  showSpinner: boolean;
  faPlus = faPlus;

  constructor(private dataService: DataService) { }

  subContractorSearchRequest= new SubContractorSearchRequest();

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
    this.showSpinner = true;
    this.resetSubContractorSearchForm();

    this.dataService.getAllSubs()
        .subscribe(data => {
          this.showSpinner = false;
          this.subContractors = data
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
  }

  rerenderTable(): void 
  {
    this.showSpinner = true;
    this.subContractors.splice(0, this.subContractors.length);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
        RadiusAroundZip: undefined
      }
    }
  }

  searchSubContractors(form?: NgForm)
  {
    console.log(form.value);
    this.rerenderTable();
    this.dataService.searchSubs(form.value)
      .subscribe(data => {
        this.showSpinner = false;
        this.subContractors = data;
        this.dtTrigger.next();
      });
  }

  isRadiusRequired(): boolean
  {
    return !this.dataService.isBlankOrNull(this.subContractorSearchRequest.City) || !this.dataService.isBlankOrNull(this.subContractorSearchRequest.ZipCode);
  }

  isStateRequired(): boolean
  {
    return !this.dataService.isBlankOrNull(this.subContractorSearchRequest.City);
  }


}
