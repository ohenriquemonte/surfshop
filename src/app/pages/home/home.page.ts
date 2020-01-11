import { LoadingController, ToastController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

    private products = new Array<Product>();
    private productsSubscriptions: Subscription;

    private loading: any;
    constructor(
        private authService: AuthService,
        private loadingCtrl: LoadingController,
        private productService: ProductService,
        private toastCtrl: ToastController
    ) {
        this.productsSubscriptions = this.productService.getProducts().subscribe(data => {
            this.products = data;
        });
    }

    async deleteProduct(id: string) {
        try {
            await this.productService.deleteProduct(id);
        } catch (error) {
            this.presentToast('Erro ao tentar deletar');
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.productsSubscriptions.unsubscribe();
    }

    async logout() {
        try {
            await this.authService.logout();
        } catch (err) {
            console.error(err);
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
}
