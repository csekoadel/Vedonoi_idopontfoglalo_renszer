import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasElsoComponent} from './foglalas-elso.component';

describe('FoglalasElsoComponent', () => {
  let component: FoglalasElsoComponent;
  let fixture: ComponentFixture<FoglalasElsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasElsoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasElsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
