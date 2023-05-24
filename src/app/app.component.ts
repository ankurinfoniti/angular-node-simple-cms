import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, PostCreateComponent],
})
export class AppComponent {
  title = 'Angular Standalone Practice';
}
