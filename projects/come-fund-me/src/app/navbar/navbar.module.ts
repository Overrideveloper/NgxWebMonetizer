import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { LoginModule } from '../login/login.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, LoginModule],
  exports: [NavbarComponent]
})
export class NavbarModule { }
