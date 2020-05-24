import { Component, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AUTH_STORAGE_KEY } from '../../constants';
import { AUTH_SUBJECT } from '../../subjects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  @Input() redirectPath: string;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  ngAfterViewInit() {
    console.log(this.redirectPath);
  }


  closeLoginModal() {
    document.getElementById('login-modal').classList.remove('is-active');
  }

  login() {
    if (this.loginForm.valid) {
      const loginBtn = document.getElementById('login-btn');
      const payload = { username: this.loginForm.controls.username.value };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      loginBtn.classList.add('is-loading');

      setTimeout(() => {
        AUTH_SUBJECT.next(payload)
        this.loginForm.reset();
        loginBtn.classList.remove('is-loading');
        this.closeLoginModal();

        if (this.redirectPath) {
          this.router.navigate([this.redirectPath]);
        }
      }, 5000);
    }
  }
}
