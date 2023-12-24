import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModsComponent } from './mods.component';

describe('ModsComponent', () => {
  let component: ModsComponent;
  let fixture: ComponentFixture<ModsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModsComponent]
    });
    fixture = TestBed.createComponent(ModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
