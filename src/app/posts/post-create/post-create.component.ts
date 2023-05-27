import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  post!: Post;
  mode = 'create';
  private postId: string = '';

  postsService = inject(PostsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.get('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.post = {
            id: 'post._id',
            title: post.title,
            content: post.content,
          };
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.postsService
        .addPost(form.value.title, form.value.content)
        .subscribe((response) => {
          this.router.navigate(['/']);
        });
    } else {
      this.postsService
        .updatePost(this.postId, form.value.title, form.value.content)
        .subscribe((response) => {
          this.router.navigate(['/']);
        });
    }

    form.resetForm();
  }
}
