import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    NavbarModule,
    RouterModule.forChild([
      { path: '', component: LandingComponent }
    ])
  ]
})
export class LandingModule { }
