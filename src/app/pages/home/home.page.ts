import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor( private navCtrl: NavController ) {}

  goToProfile(){
    this.navCtrl.navigateForward('/profile')
  }

  logOut() {
    this.navCtrl.navigateBack('/login')
  }
}
