import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  title = '';
  content = '';
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost() {
    const post: Post = {
      title: this.title,
      content: this.content,
    };

    this.postCreated.emit(post);
  }
}
