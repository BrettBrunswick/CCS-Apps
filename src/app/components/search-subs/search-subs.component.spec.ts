import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSubsComponent } from './search-subs.component';

describe('SearchSubsComponent', () => {
  let component: SearchSubsComponent;
  let fixture: ComponentFixture<SearchSubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
