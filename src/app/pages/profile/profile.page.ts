import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: any = null;
  isEditing: boolean = false;
  originalUser: any = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async ionViewWillEnter() {
    this.user = await this.authService.getCurrentUser();
    this.originalUser = { ...this.user };
    console.log('Usuario en perfil:', this.user);
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.user = { ...this.originalUser };
    this.isEditing = false;
  }

  async saveProfile() {
    try {
      await this.authService.updateUser(this.user);
      this.isEditing = false;
      this.originalUser = { ...this.user };
      console.log('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.user = null;
    this.router.navigate(['/login']);
  }

  closeProfile() {
    this.navCtrl.navigateBack('/home');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
}