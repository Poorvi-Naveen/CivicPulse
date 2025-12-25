import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../modules/auth/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // NEW: Emits event to parent when menu button is clicked
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string = 'User';
  userRole: string = 'Guest';
  userInitials: string = 'U';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // UPDATED: Dynamic subscription
    this.authService.currentUser.subscribe(user => {
        if (user) {
            this.userName = user.name || 'User';
            this.userRole = user.role || 'Guest';
            this.userInitials = this.userName.charAt(0).toUpperCase();
        }
    });
  }

  logout() {
    this.authService.logout();
  }
}