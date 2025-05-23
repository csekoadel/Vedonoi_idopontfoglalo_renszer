import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasHarmadikComponent} from './foglalas-harmadik.component';

describe('FoglalasNegyedikComponent', () => {
  let component: FoglalasHarmadikComponent;
  let fixture: ComponentFixture<FoglalasHarmadikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasHarmadikComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasHarmadikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
