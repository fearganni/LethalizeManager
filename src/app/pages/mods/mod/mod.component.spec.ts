import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModComponent } from './mod.component';

describe('ModComponent', () => {
  let component: ModComponent;
  let fixture: ComponentFixture<ModComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModComponent]
    });
    fixture = TestBed.createComponent(ModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
