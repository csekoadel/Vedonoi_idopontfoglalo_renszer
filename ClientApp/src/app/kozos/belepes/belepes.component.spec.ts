import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BelepesComponent} from './belepes.component';

describe('BelepesComponent', () => {
  let component: BelepesComponent;
  let fixture: ComponentFixture<BelepesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BelepesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BelepesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
