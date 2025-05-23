import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NaptarKezeloComponent} from './naptar-kezelo.component';

describe('NaptarKezeloComponent', () => {
  let component: NaptarKezeloComponent;
  let fixture: ComponentFixture<NaptarKezeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaptarKezeloComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NaptarKezeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
