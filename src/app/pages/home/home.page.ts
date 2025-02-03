import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  buttonState: 'normal' | 'pressed' | 'complete' = 'normal';
  timer: any;

  get buttonText(): string {
    switch(this.buttonState){
      case 'normal': return 'pulsame'

      case 'pressed': return 'pulsando'

      case 'complete': return 'completado'
    }
  }
  constructor( private navCtrl: NavController,private alertCtrl: AlertController ) {}

  goToProfile(){
    this.navCtrl.navigateForward('/profile')
  }

  logOut() {
    this.navCtrl.navigateBack('/login')
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Esto es una alerta',
      message: 'Accion realizada.',
      buttons: ['Action'],
    });

    await alert.present();

    this.buttonState = 'normal';
  }

  onPressed(){
    console.log('se esta pulsando');
    this.buttonState = 'pressed';
    this.timer = setTimeout(() => {
      this.buttonState = 'complete';
      setTimeout(() => {
        this.presentAlert();
      }, 1000)
    }, 5000)
  }

  onReleased(){
    if(this.buttonState === 'complete') return;
    console.log('se dejo de pulsar');
    this.buttonState = 'normal';

    clearTimeout(this.timer);
  }

}
