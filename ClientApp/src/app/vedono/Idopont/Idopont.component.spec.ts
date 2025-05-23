import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdopontComponent} from './Idopont.component';

describe('IdopontComponent', () => {
  let component: IdopontComponent;
  let fixture: ComponentFixture<IdopontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdopontComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IdopontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
