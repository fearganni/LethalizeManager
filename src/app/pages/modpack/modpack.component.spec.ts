import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModpackComponent } from './modpack.component';

describe('ModpackComponent', () => {
  let component: ModpackComponent;
  let fixture: ComponentFixture<ModpackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModpackComponent]
    });
    fixture = TestBed.createComponent(ModpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
