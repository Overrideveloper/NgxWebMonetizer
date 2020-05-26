import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AUTH_SUBJECT } from '../subjects';

@Injectable({providedIn: 'root'})
export class CanActivateUser implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {
        const auth = AUTH_SUBJECT.getValue();

        if (auth) {
            return true;
        }

        this.router.navigate(['']);
        return false;
    }
}