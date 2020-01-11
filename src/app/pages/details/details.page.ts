
import { Subscription } from 'rxjs';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { ProductService } from './../../services/product.service';
import { Product } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
    private product: Product = {};
    private productId: string;
    private productSubscription: Subscription;
    private loading: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private authService: AuthService,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private productService: ProductService,
        private toastCtrl: ToastController
    ) {
        this.productId = this.activeRoute.snapshot.params[`id`];

        if (this.productId) {
            this.loadProduct();
        }
    }

    loadProduct() {
        this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
            this.product = data;
        });
    }

    ngOnInit() {
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

    async saveProduct() {
        await this.presentLoading();

        this.product.userId = this.authService.getAuth().currentUser.uid;

        if (this.productId) {

        } else {
            this.product.createdAt = new Date().getTime();

            try {
                await this.productService.addProducts(this.product);
                await this.loading.dismiss();
                this.navCtrl.navigateBack('/home');
            } catch (err) {
                this.presentToast(`Erro ao tentar salvar produto!`);
                this.loading.dismiss();
            }
        }
    }
}
