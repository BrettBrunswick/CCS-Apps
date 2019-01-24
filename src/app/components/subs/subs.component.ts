import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { SubContractor } from 'src/app/models/SubContractor';
import { Location } from 'src/app/models/Location';
import { Trade } from 'src/app/models/Trade';
import { AgmMap } from '@agm/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  sub: SubContractor = new SubContractor();

  subLocation: Location = new Location();
  showLocationSpinner = true;

  editSub: SubContractor = new SubContractor();
  trades: Trade[];
  states: string[];

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
  }


  getSubContractor()
  {
    const subId = +this.route.snapshot.paramMap.get('id');
    this.dataService.getSubById(subId)
      .subscribe(data => {
        this.sub.Name = data['name'];
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
        this.editSub = this.sub;
        this.showSpinner = false;
        console.log(this.editSub);
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
    console.log(this.editSub);
  }

}
