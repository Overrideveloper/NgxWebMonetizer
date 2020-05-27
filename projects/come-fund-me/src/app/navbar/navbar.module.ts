import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { LoginModule } from '../login/login.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, LoginModule, RouterModule],
  exports: [NavbarComponent]
})
export class NavbarModule { }
