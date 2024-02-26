import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent {

  constructor(private el: ElementRef, private authService: AuthService) { }

  ngOnInit() {
    const menu = this.el.nativeElement.querySelector('#menu-icon');
    const userName = sessionStorage.getItem('userName');

    if (userName) {
      const loggedUserNameElement = document.getElementById('loggedUserName') as HTMLElement;
      if (loggedUserNameElement) {
        loggedUserNameElement.innerText = userName;
      }
    }

    menu?.addEventListener('click', () => {
      const navbar = this.el.nativeElement.querySelector('.navbar');

      menu.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    });
  }

  sair() {
    this.authService.fazerLogout();
  }

}
