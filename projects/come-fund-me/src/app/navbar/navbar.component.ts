import { Component, Input } from '@angular/core';
import { AUTH_SUBJECT } from '../../subjects';
import { AUTH_STORAGE_KEY } from '../../constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() loginRedirectPath: string;

  authBtnText: 'Sign in' | 'Log out';

  constructor() {
    AUTH_SUBJECT.subscribe(val => this.authBtnText = val ? 'Log out' : 'Sign in');
  }

  toggleMenu() {
    document.getElementById('navbar-menu').classList.toggle('is-active');
  }

  authAction() {
    if (AUTH_SUBJECT.getValue()) {
      Swal.fire({
        title: 'Log out',
        text: 'Are you sure?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00d1b2',
        confirmButtonText: 'Confirm'
      }).then(logout => {
        if (logout.value) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          AUTH_SUBJECT.next(null);
        }
      });
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal() {
    document.getElementById('login-modal').classList.add('is-active');
  }
}
