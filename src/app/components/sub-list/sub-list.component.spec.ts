import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubListComponent } from './sub-list.component';

describe('SubListComponent', () => {
  let component: SubListComponent;
  let fixture: ComponentFixture<SubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
