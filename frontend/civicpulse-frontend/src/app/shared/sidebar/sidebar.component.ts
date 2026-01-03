// frontend/civicpulse-frontend/src/app/shared/sidebar/sidebar.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  // NEW: Inputs for responsive control
  @Input() isOpen = false; 
  @Output() closeSidebar = new EventEmitter<void>();

  role: string = '';
  menuItems: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // UPDATED: Subscribe to user changes instantly
    this.authService.currentUser.subscribe(user => {
        this.role = user?.role || 'CITIZEN';
        this.setMenu();
    });
  }

  setMenu() {
    if (this.role === 'CITIZEN') {
      this.menuItems = [
        { label: 'Dashboard', link: '/citizen/dashboard', icon: 'dashboard' },
        { label: 'Submit Grievance', link: '/citizen/submit-grievance', icon: 'add_circle' },
        { label: 'My Complaints', link: '/citizen/my-complaints', icon: 'list' },
        { label: 'Feedback', link: '/citizen/feedback', icon: 'thumb_up' }
      ];
    } 
    else if (this.role === 'OFFICER') {
      this.menuItems = [
        { label: 'Dashboard', link: '/officer/dashboard', icon: 'dashboard' },
        { label: 'Assigned Tasks', link: '/officer/assigned-grievances', icon: 'assignment_ind' },
        { label: 'Update Status', link: '/officer/update-status', icon: 'edit_note' },
        { label: 'History', link: '/officer/resolved-history', icon: 'history' }
      ];
    } 
    else if (this.role === 'ADMIN') {
      this.menuItems = [
        { label: 'Overview', link: '/admin/dashboard', icon: 'analytics' },
        { label: 'All Grievances', link: '/admin/all-grievances', icon: 'view_list' },
        { label: 'Manage Users', link: '/admin/users', icon: 'people' },
        { label: 'Assign Officers', link: '/admin/assign-officer', icon: 'badge' },
        { label: 'Resolution Reviews', link: '/admin/resolution-review', icon: 'gavel' },
        { label: 'Reports', link: '/admin/reports', icon: 'summarize' }
      ];
    }
  }

  // NEW: Close sidebar when a link is clicked (Mobile UX)
  onLinkClick() {
    if (window.innerWidth < 768) {
      this.closeSidebar.emit();
    }
  }
}