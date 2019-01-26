import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSpinnerComponent } from './post-spinner.component';

describe('PostSpinnerComponent', () => {
  let component: PostSpinnerComponent;
  let fixture: ComponentFixture<PostSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
