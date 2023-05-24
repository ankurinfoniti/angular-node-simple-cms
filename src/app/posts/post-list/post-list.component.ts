import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  @Input() posts: Post[] = [];
}
