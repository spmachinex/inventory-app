import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../auth.service';

const GET_ANALYTICS = gql`
  query { getAnalytics { totalProducts totalStockValue lowStockCount categoryCount } }
`;
const GET_PRODUCTS = gql`
  query { getProducts { id name price quantity category { id name } createdBy { username } createdAt } }
`;
const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) { id name price quantity category { id name } createdBy { username } }
  }
`;
const GET_USERS = gql`
  query { getUsers { id username role { name } } }
`;
const GET_CATEGORIES = gql`
  query { getCategories { id name } }
`;
const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $categoryId: ID!, $price: Float!, $quantity: Int!) {
    addProduct(name: $name, categoryId: $categoryId, price: $price, quantity: $quantity) { id name }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $categoryId: ID, $price: Float, $quantity: Int) {
    updateProduct(id: $id, name: $name, categoryId: $categoryId, price: $price, quantity: $quantity) {
      id name price quantity category { id name }
    }
  }
`;
const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }
`;
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) { deleteUser(id: $id) }
`;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
})
export class AdminComponent implements OnInit {
  analytics: any = null;
  products: any[] = [];
  filteredProducts: any[] = [];
  users: any[] = [];
  categories: any[] = [];
  activeTab = 'products';

  searchKeyword = '';
  sortField = '';
  sortAsc = true;

  form = { name: '', categoryId: '', price: 0, quantity: 0 };
  editingProduct: any = null;
  editForm = { name: '', categoryId: '', price: 0, quantity: 0 };

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadAnalytics();
    this.loadProducts();
    this.loadUsers();
    this.loadCategories();
  }

  loadAnalytics() {
    this.apollo.watchQuery({ query: GET_ANALYTICS })
      .valueChanges.subscribe({
        next: ({ data }: any) => this.analytics = data.getAnalytics,
        error: () => this.router.navigate(['/login'])
      });
  }

  loadProducts() {
    this.apollo.watchQuery({ query: GET_PRODUCTS })
      .valueChanges.subscribe({
        next: ({ data }: any) => {
          this.products = data.getProducts;
          this.filteredProducts = [...this.products];
        },
        error: () => this.router.navigate(['/login'])
      });
  }

  loadUsers() {
    this.apollo.watchQuery({ query: GET_USERS })
      .valueChanges.subscribe({
        next: ({ data }: any) => this.users = data.getUsers,
      });
  }

  loadCategories() {
    this.apollo.watchQuery({ query: GET_CATEGORIES })
      .valueChanges.subscribe({
        next: ({ data }: any) => this.categories = data.getCategories,
      });
  }

  search() {
    if (!this.searchKeyword.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.apollo.query({ query: SEARCH_PRODUCTS, variables: { keyword: this.searchKeyword } })
      .subscribe(({ data }: any) => this.filteredProducts = data.searchProducts);
  }

  sort(field: string) {
    if (this.sortField === field) this.sortAsc = !this.sortAsc;
    else { this.sortField = field; this.sortAsc = true; }
    this.filteredProducts = [...this.filteredProducts].sort((a, b) =>
      this.sortAsc ? a[field] - b[field] : b[field] - a[field]);
  }

  addProduct() {
    if (!this.form.name || !this.form.categoryId) return;
    this.apollo.mutate({
      mutation: ADD_PRODUCT,
      variables: {
        name: this.form.name,
        categoryId: this.form.categoryId,
        price: parseFloat(this.form.price.toString()),
        quantity: parseInt(this.form.quantity.toString()),
      }
    }).subscribe(() => {
      this.form = { name: '', categoryId: '', price: 0, quantity: 0 };
      this.loadProducts();
      this.loadAnalytics();
    });
  }

  startEdit(product: any) {
    this.editingProduct = product;
    this.editForm = {
      name: product.name,
      categoryId: product.category.id,
      price: product.price,
      quantity: product.quantity
    };
  }

  cancelEdit() { this.editingProduct = null; }

  updateProduct() {
    this.apollo.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id: this.editingProduct.id,
        name: this.editForm.name,
        categoryId: this.editForm.categoryId,
        price: parseFloat(this.editForm.price.toString()),
        quantity: parseInt(this.editForm.quantity.toString()),
      }
    }).subscribe(() => {
      this.editingProduct = null;
      this.loadProducts();
      this.loadAnalytics();
    });
  }

  deleteProduct(id: string) {
    this.apollo.mutate({ mutation: DELETE_PRODUCT, variables: { id } })
      .subscribe(() => { this.loadProducts(); this.loadAnalytics(); });
  }

  deleteUser(id: string) {
    this.apollo.mutate({ mutation: DELETE_USER, variables: { id } })
      .subscribe(() => this.loadUsers());
  }

  isLowStock(quantity: number) { return quantity < 10; }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}