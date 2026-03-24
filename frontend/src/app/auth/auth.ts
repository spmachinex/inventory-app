import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
})
export class AuthComponent {
  isLogin = true;
  username = '';
  password = '';
  role = 'USER';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggle() {
    this.isLogin = !this.isLogin;
    this.message = '';
    this.error = '';
  }

  submit() {
    this.message = '';
    this.error = '';
    if (this.isLogin) {
      this.authService.login(this.username, this.password).subscribe({
        next: (res: any) => {
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => this.error = 'Invalid username or password'
      });
    } else {
      this.authService.register(this.username, this.password, this.role).subscribe({
        next: () => {
          this.message = 'Registered! Please login.';
          this.isLogin = true;
        },
        error: () => this.error = 'Registration failed'
      });
    }
  }
}