import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  // Declare the form group for product form
  productForm: FormGroup;
  filteredCategory: string = '';
  categories = ['Electronics', 'Clothing', 'Books'];
  displayedColumns: string[] = ['name', 'price', 'category', 'inStock', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  // Set flag for edit mode
  isEditMode: boolean = false;
  editProductId: number | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      inStock: [false],
    });
  }

  // Fetch product data and populate table
  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.dataSource.data = products;
    });
  }

  // Toggle the inStock status of a product
  toggleInStock(product: Product) {
    this.productService.toggleInStock(product.id);
  }

  // Delete a product
  deleteProduct(id: number) {
    this.productService.deleteProduct(id);
    this.dataSource.data = this.dataSource.data.filter((product) => product.id !== id); // Remove from list
  }

  // Filter products by category
  filterByCategory() {
    this.productService.getProducts().pipe(
      map((products) =>
        products.filter(
          (product) =>
            product.category === this.filteredCategory || this.filteredCategory === ''
        )
      )
    ).subscribe(filteredProducts => {
      this.dataSource.data = filteredProducts;
    });
  }

  // Open the product form for editing a product
  editProduct(product: Product) {
    this.isEditMode = true;
    this.editProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
    });
  }

  // Submit the form to add or edit a product
  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditMode) {
        // Update product if in edit mode
        this.productService.updateProduct(this.editProductId!, productData);
        const updatedProductList = this.dataSource.data.map((product) =>
          product.id === this.editProductId ? { ...product, ...productData } : product
        );
        this.dataSource.data = updatedProductList;
      } else {
        // Add new product if not in edit mode
        const newProduct = { ...productData, id: new Date().getTime() }; // Simulate unique ID
        this.productService.addProduct(newProduct);
        this.dataSource.data = [...this.dataSource.data, newProduct];
      }
      this.productForm.reset();
      this.isEditMode = false;
      this.editProductId = null;
    }
  }
}