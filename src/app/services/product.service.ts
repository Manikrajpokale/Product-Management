import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true },
    { id: 2, name: 'Shirt', price: 30, category: 'Clothing', inStock: false },
    { id: 3, name: 'Book', price: 15, category: 'Books', inStock: true },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  addProduct(product: Product): void {
    const newProduct = { ...product, id: this.products.length + 1 };
    this.products.push(newProduct);
  }

  updateProduct(id: number, updatedProduct: Product): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...updatedProduct, id };
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter((product) => product.id !== id);
  }

  toggleInStock(productId: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.inStock = !product.inStock;
    }
  }
}
