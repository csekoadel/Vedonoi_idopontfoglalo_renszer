import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FoglalasaimComponent} from './foglalasaim.component';

describe('FoglalasaimComponent', () => {
  let component: FoglalasaimComponent;
  let fixture: ComponentFixture<FoglalasaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasaimComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
