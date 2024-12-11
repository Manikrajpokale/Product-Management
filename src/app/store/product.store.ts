import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private products = new BehaviorSubject<Product[]>([]);
  private products$ = this.products.asObservable();

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  addProduct(product: Product): void {
    const current = this.products.value;
    this.products.next([...current, product]);
  }

  updateProduct(product: Product): void {
    const current = this.products.value.map((p) =>
      p.id === product.id ? product : p
    );
    this.products.next(current);
  }

  deleteProduct(id: number): void {
    const current = this.products.value.filter((p) => p.id !== id);
    this.products.next(current);
  }

  toggleInStock(id: number): void {
    const current = this.products.value.map((p) =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    );
    this.products.next(current);
  }
}
