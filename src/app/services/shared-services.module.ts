import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { FacesService } from './faces.service';
import { UsersService } from './users.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, FacesService, UsersService],
})
export class SharedServicesModule {}
