import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarModule } from '../navbar/navbar.module';
import { ProjectComponent } from './project.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    NavbarModule,
    PipesModule,
    RouterModule.forChild([
      { path: '', component: ProjectComponent }
    ])
  ]
})
export class ProjectModule { }
