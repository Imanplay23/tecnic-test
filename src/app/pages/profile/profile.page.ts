import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {
  user: any = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private navCtrl: NavController) {}

  async ionViewWillEnter() {
    this.user = await this.authService.getCurrentUser();
    console.log('Usuario en perfil:', this.user);  
  }

  async logout() {
    await this.authService.logout();
    this.user = null;
    this.router.navigate(['/login'])
  }

  closeProfile(){
    this.navCtrl.navigateBack('/home')
  }
}
