import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tower3dModelComponent } from './tower3d-model.component';

describe('Tower3dModelComponent', () => {
  let component: Tower3dModelComponent;
  let fixture: ComponentFixture<Tower3dModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tower3dModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tower3dModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
