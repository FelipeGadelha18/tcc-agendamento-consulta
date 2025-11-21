import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestritoLayoutComponent } from './restrito-layout.component';

describe('RestritoLayoutComponent', () => {
  let component: RestritoLayoutComponent;
  let fixture: ComponentFixture<RestritoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestritoLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestritoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
