import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonorsComponent } from './donors.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [DonorsComponent],
  imports: [CommonModule, PipesModule],
  exports: [DonorsComponent]
})
export class DonorsModule { }
