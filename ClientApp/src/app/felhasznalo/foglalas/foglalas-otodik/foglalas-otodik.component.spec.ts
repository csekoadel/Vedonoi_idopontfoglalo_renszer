import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasOtodikComponent} from './foglalas-otodik.component';

describe('FoglalasOtodikComponent', () => {
  let component: FoglalasOtodikComponent;
  let fixture: ComponentFixture<FoglalasOtodikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasOtodikComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasOtodikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
