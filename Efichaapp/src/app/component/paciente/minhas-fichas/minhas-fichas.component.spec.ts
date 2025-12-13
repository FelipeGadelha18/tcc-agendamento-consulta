import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasFichasComponent } from './minhas-fichas.component';

describe('MinhasFichasComponent', () => {
  let component: MinhasFichasComponent;
  let fixture: ComponentFixture<MinhasFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasFichasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
