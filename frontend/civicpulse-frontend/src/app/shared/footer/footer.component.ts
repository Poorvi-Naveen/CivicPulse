import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2025 <strong>CivicPulse</strong>. Empowering Citizens, Enhancing Governance.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <span class="divider">•</span>
          <a href="#">Terms of Service</a>
          <span class="divider">•</span>
          <a href="#">Help Center</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: white;
      border-top: 1px solid #eaeaea;
      padding: 20px 30px;
      margin-top: auto; /* Pushes footer to bottom */
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      color: #666;
      font-size: 0.9rem;
    }
    .footer-links a {
      color: #003366;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: #FF9933; }
    .divider { margin: 0 10px; color: #ccc; }
    
    @media (max-width: 768px) {
      .footer-content { flex-direction: column; gap: 10px; text-align: center; }
    }
  `]
})
export class FooterComponent {}