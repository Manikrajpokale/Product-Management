import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: false,
  
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  product: Product = { id: 0, name: '', price: 0, category: '', inStock: true };
  categories = ['Electronics', 'Clothing', 'Books'];
  isEdit = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    if (productId) {
      this.isEdit = true;
      this.productService.getProducts().subscribe((products) => {
        const product = products.find(p => p.id === productId);
        if (product) {
          this.product = { ...product };
        }
      });
    }
  }

  onSubmit() {
    if (this.isEdit) {
      // this.productService.updateProduct(this.product);
    } else {
      this.productService.addProduct({ ...this.product });
    }
    this.router.navigate(['/products']);
  }

  resetForm() {
    this.product = { id: 0, name: '', price: 0, category: '', inStock: true };
  }
}