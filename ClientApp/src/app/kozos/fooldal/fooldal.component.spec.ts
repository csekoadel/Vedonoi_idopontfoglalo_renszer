import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FooldalComponent} from './fooldal.component';

describe('MainComponent', () => {
  let component: FooldalComponent;
  let fixture: ComponentFixture<FooldalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooldalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FooldalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
