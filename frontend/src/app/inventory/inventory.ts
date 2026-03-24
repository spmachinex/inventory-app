import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../auth.service';

const GET_PRODUCTS = gql`
  query { getProducts { id name category price quantity } }
`;
const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $category: String!, $price: Float!, $quantity: Int!) {
    addProduct(name: $name, category: $category, price: $price, quantity: $quantity) { id name }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $category: String, $price: Float, $quantity: Int) {
    updateProduct(id: $id, name: $name, category: $category, price: $price, quantity: $quantity) {
      id name category price quantity
    }
  }
`;
const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }
`;

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  loading = false;
  form = { name: '', category: '', price: 0, quantity: 0 };
  editingProduct: any = null;
  editForm = { name: '', category: '', price: 0, quantity: 0 };

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.loading = true;
    this.apollo.watchQuery({ query: GET_PRODUCTS, fetchPolicy: 'network-only' })
      .valueChanges.subscribe({
        next: ({ data }: any) => {
          if (data?.getProducts) this.products = data.getProducts;
          this.loading = false;
        },
        error: () => this.router.navigate(['/login'])
      });
  }

  addProduct() {
    if (!this.form.name || !this.form.category) return;
    this.apollo.mutate({
      mutation: ADD_PRODUCT,
      variables: {
        name: this.form.name,
        category: this.form.category,
        price: parseFloat(this.form.price.toString()),
        quantity: parseInt(this.form.quantity.toString()),
      }
    }).subscribe(() => {
      this.form = { name: '', category: '', price: 0, quantity: 0 };
      this.loadProducts();
    });
  }

  startEdit(product: any) {
    this.editingProduct = product;
    this.editForm = { name: product.name, category: product.category, price: product.price, quantity: product.quantity };
  }

  cancelEdit() { this.editingProduct = null; }

  updateProduct() {
    this.apollo.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id: this.editingProduct.id,
        name: this.editForm.name,
        category: this.editForm.category,
        price: parseFloat(this.editForm.price.toString()),
        quantity: parseInt(this.editForm.quantity.toString()),
      }
    }).subscribe(() => {
      this.editingProduct = null;
      this.loadProducts();
    });
  }

  deleteProduct(id: string) {
    this.apollo.mutate({ mutation: DELETE_PRODUCT, variables: { id } })
      .subscribe(() => this.loadProducts());
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}