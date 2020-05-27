import { Component, Input } from '@angular/core';
import { AUTH_SUBJECT } from '../../subjects';
import { AUTH_STORAGE_KEY } from '../../constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() loginRedirectPath: string;
  @Input() transparent: boolean;

  authBtnText: 'Sign in' | 'Log out';
  username: string;

  constructor(private router: Router) {
    AUTH_SUBJECT.subscribe(val => {
      this.username = val ? val.username : null;
      this.authBtnText = val ? 'Log out' : 'Sign in'
    });
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
          this.router.navigate(['']);
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
