import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { SubContractor } from 'src/app/models/SubContractor';
import { Location } from 'src/app/models/Location';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'app-subs',
  templateUrl: './subs.component.html',
  styleUrls: ['./subs.component.css']
})
export class SubsComponent implements OnInit {
  @ViewChild(AgmMap) public agmMap: AgmMap

  sub: SubContractor = new SubContractor();
  location: Location = new Location();

  showSpinner = true;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() 
  {
    this.getSubContractor();
  }


  getSubContractor()
  {
    const subId = +this.route.snapshot.paramMap.get('id');
    this.dataService.getSubById(subId)
      .subscribe(data => {
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
        this.sub.TradeName = data['trade']['name'];
        this.showSpinner = false;
        console.log(this.sub)
        this.getLocation();
      });
  }

  getLocation()
  {
    this.dataService.getLocationByZip(this.sub.ZipCode)
      .subscribe(data => {
        this.location.Latitude = data[0]['latitude'];
        this.location.Longitute = data[0]['longitude'];
        console.log(this.location);
    });
  }

  isLocationDefined(): boolean
  {
    return (this.location.Longitute != undefined && this.location.Latitude != undefined);
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

}
