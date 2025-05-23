import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UjgyermekComponent} from './ujgyermek.component';

describe('UjfoglalasComponent', () => {
  let component: UjgyermekComponent;
  let fixture: ComponentFixture<UjgyermekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UjgyermekComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UjgyermekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
