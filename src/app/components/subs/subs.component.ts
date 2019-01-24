import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubContractor } from 'src/app/models/SubContractor';
import { SubContractorList } from 'src/app/models/SubContractorList';
import { Location } from 'src/app/models/Location';
import { Trade } from 'src/app/models/Trade';
import { AgmMap } from '@agm/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; 
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subs',
  templateUrl: './subs.component.html',
  styleUrls: ['./subs.component.css']
})
export class SubsComponent implements OnInit {
  @ViewChild(AgmMap) public agmMap: AgmMap

  subId = +this.route.snapshot.paramMap.get('id');
  sub: SubContractor = new SubContractor();

  subLocation: Location = new Location();
  showLocationSpinner = true;

  trades: Trade[];
  states: string[];

  subContractorLists: SubContractorList[];
  listToAddSubTo: SubContractorList;


  showSpinner = true;
  faPencilAlt = faPencilAlt;
  faPlus = faPlus;

  constructor(private dataService: DataService, private route: ActivatedRoute, 
    private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() 
  {
    this.initializeData();
  }

  initializeData(): void
  {
    this.getSubContractor();

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
          this.showSpinner = false;
          this.subContractorLists = data
        });
  }


  getSubContractor()
  {
    this.dataService.getSubById(this.subId)
      .subscribe(data => {
        this.sub.Id = data['id'];
        this.sub.Name = data['name'];
        this.sub.AddressLine1 = data['addressLine1'];
        this.sub.AddressLine2 = data['addressLine2'];
        this.sub.State = data['state'];
        this.sub.City = data['city'];
        this.sub.ZipCode = data['zipCode'];
        this.sub.WebsiteURL = data['websiteURL'];
        this.sub.OfficePhone = data['officePhone'];
        this.sub.OfficeEmail = data['officeEmail'];
        this.sub.OfficeFax = data['officeFax'];
        this.sub.Source = data['source'];
        this.sub.Trade = data['trade'];
        this.showSpinner = false;
        this.getLocation();
      });
  }

  getLocation()
  {
    this.dataService.getLocationByZip(this.sub.ZipCode)
      .subscribe(data => {
        this.subLocation.Latitude = +data[0]['latitude'];
        this.subLocation.Longitute = +data[0]['longitude'];
        this.showLocationSpinner = false;
    });
  }

  open(content) 
  {
    this.modalService.open(content, {size: 'lg'});
  }

  openSmall(content) 
  {
    this.modalService.open(content, {size: 'sm'});
  }

  editSubContractor(form: NgForm)
  {
    this.showSpinner = true;
    this.dataService.editSubContractor(form.value, this.subId).subscribe(success => {
      if (success) 
      {
        this.toastr.success('Account successfully updated.', 'Success');
        this.showSpinner = false;
      }
    }, (err : HttpErrorResponse) => 
    {
      this.showSpinner = false;
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

  addSubToList(form: NgForm)
  {
    this.showSpinner = true;
    console.log('sub id: ' + this.subId);
    console.log(form.value.subContractorList.name);
    this.showSpinner = false;
  }

  isLocationDefined(): boolean
  {
    return (this.subLocation.Longitute != undefined && this.subLocation.Latitude != undefined);
  }

  hasAddressLine1()
  {
    return !this.dataService.isBlankOrNull(this.sub.AddressLine1);
  }

  hasAddressLine2()
  {
    return !this.dataService.isBlankOrNull(this.sub.AddressLine2);
  }

  hasCity()
  {
    return !this.dataService.isBlankOrNull(this.sub.City);
  }

  hasState()
  {
    return !this.dataService.isBlankOrNull(this.sub.State);
  }

  hasZipCode()
  {
    return !this.dataService.isBlankOrNull(this.sub.ZipCode);
  }

  logEditSubForm()
  {
    console.log('org sub: ' + this.sub.Name);
  }

  hasFormInputChanged(input: any, orgValue: any): boolean
  {
    if (typeof input == 'string')
    {
      input == null ? input = '' : input = input;
      orgValue == null ? orgValue = '' : orgValue = orgValue;
      return input.toLowerCase().trim() != orgValue.toLowerCase().trim();
    } 
    else 
    {
      return input == null ? false : input.id != orgValue.id;
    }
  }

  hasFormChanged(form: any): boolean
  {
    return (  this.hasFormInputChanged(form.value.editSubName, this.sub.Name)  || 
              this.hasFormInputChanged(form.value.Trade, this.sub.Trade) ||
              this.hasFormInputChanged(form.value.editSubWebsite, this.sub.WebsiteURL) ||
              this.hasFormInputChanged(form.value.editSubContactName, this.sub.OfficeEmail) ||
              this.hasFormInputChanged(form.value.editSubEmail, this.sub.OfficeEmail) ||
              this.hasFormInputChanged(form.value.editSubPhone, this.sub.OfficePhone) ||
              this.hasFormInputChanged(form.value.editSubFax, this.sub.OfficeFax) ||
              this.hasFormInputChanged(form.value.editSubAddress1, this.sub.AddressLine1) ||
              this.hasFormInputChanged(form.value.editSubAddress2, this.sub.AddressLine2) ||
              this.hasFormInputChanged(form.value.editSubCity, this.sub.City) ||
              this.hasFormInputChanged(form.value.State, this.sub.State) ||
              this.hasFormInputChanged(form.value.editSubZipCode, this.sub.ZipCode)
    );
  }

}
