import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasNegyedikComponent} from './foglalas-negyedik.component';

describe('FoglalasNegyedikComponent', () => {
  let component: FoglalasNegyedikComponent;
  let fixture: ComponentFixture<FoglalasNegyedikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasNegyedikComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasNegyedikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
