import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoglalasMasodikComponent} from './foglalas-masodik.component';

describe('FoglalasMasodikComponent', () => {
  let component: FoglalasMasodikComponent;
  let fixture: ComponentFixture<FoglalasMasodikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoglalasMasodikComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoglalasMasodikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
