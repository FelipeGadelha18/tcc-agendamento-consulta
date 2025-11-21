import { Component,HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../component/layouts/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-restrito-layout',
  imports: [FooterComponent, RouterOutlet,],
  templateUrl: './restrito-layout.component.html',
  styleUrls: ['./restrito-layout.component.scss']
})
export class RestritoLayoutComponent {
      
}
