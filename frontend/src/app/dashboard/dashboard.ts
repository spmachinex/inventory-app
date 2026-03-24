import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../auth.service';

const GET_PRODUCTS = gql`
  query { getProducts { id name price quantity category { name } createdBy { username } } }
`;
const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) { id name price quantity category { name } }
  }
`;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchKeyword = '';
  sortField = '';
  sortAsc = true;

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  ngOnInit() { this.loadProducts(); }

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

  isLowStock(quantity: number) { return quantity < 10; }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}