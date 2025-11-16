import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroComponent } from './cadastro.component';
import { ReactiveFormsModule } from '@angular/forms';


describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});