import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild(IonSlides, { static: true }) slides: IonSlides;

    wavesPosition = 0;
    wavesDifference = 300;

    userLogin: User = {};
    userRegister: User = {};

    private loading;

    constructor(
        public keyboard: Keyboard,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {

    }

    async login() {
        await this.presentLoading();

        try {
            await this.authService.login(this.userLogin);
        } catch (err) {
            console.error(err);
            this.presentToast(err.message);
        } finally {
            this.loading.dismiss();
        }
    }

    async presentLoading() {
        this.loading = await this.loadingCtrl.create({
            message: 'Aguarde ...',
        });
        return this.loading.present();
    }

    async presentToast(message: string, duration?: number) {
        if (!duration) {
            duration = 3000;
        }

        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        toast.present();
    }

    async register() {
        await this.presentLoading();

        try {
            await this.authService.register(this.userRegister);
        } catch (err) {
            console.error(err);
            this.presentToast(err.message);
        } finally {
            this.loading.dismiss();
        }
    }

    segmentChanged(event: any) {
        if (event.detail.value === 'login') {
            this.slides.slidePrev();
            this.wavesPosition += this.wavesDifference;
        } else {
            this.slides.slideNext();
            this.wavesPosition -= this.wavesDifference;
        }
    }
}
