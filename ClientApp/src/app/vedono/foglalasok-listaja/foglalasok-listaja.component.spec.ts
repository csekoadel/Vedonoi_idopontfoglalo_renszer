import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasokListajaComponent} from './foglalasok-listaja.component';

describe('FoglalasokListajaComponent', () => {
  let component: FoglalasokListajaComponent;
  let fixture: ComponentFixture<FoglalasokListajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasokListajaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasokListajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
