
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../interfaces/product';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productsCollection: AngularFirestoreCollection<Product>;

    constructor(private afs: AngularFirestore) {
        this.productsCollection = this.afs.collection<Product>(`Products`);
    }

    addProducts(product: Product) {
        return this.productsCollection.add(product);
    }

    deleteProduct(id: string) {
        return this.productsCollection.doc(id).delete();
    }

    getProduct(id: string) {
        return this.productsCollection.doc<Product>(id).valueChanges(); // valueChanges não retorna o id
    }

    getProducts() {
        // snapShotChanges retorna o id
        return this.productsCollection.snapshotChanges().pipe(map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;

                return { id, ...data };
            });
        }));
    }

    updateProducts(id: string, product: Product) {

    }
}
