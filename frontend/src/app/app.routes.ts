import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { AdminComponent } from './admin/admin';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
];
// ```

// ---

// Your folder structure should now be:
// ```
// src/app/
// ├── app.ts
// ├── app.config.ts
// ├── app.routes.ts
// ├── auth.service.ts
// ├── auth/
// │   ├── auth.ts
// │   └── auth.html
// ├── admin/
// │   ├── admin.ts
// │   └── admin.html
// └── dashboard/
//     ├── dashboard.ts
//     └── dashboard.html