import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilSzComponent} from './profilSz.component';

describe('ProfilComponent', () => {
  let component: ProfilSzComponent;
  let fixture: ComponentFixture<ProfilSzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilSzComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilSzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
