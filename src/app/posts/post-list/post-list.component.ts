import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { environment as env } from 'src/environments/environment';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  apiUrl = `${env.IMAGE_URL}`;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub!: Subscription;

  postsService = inject(PostsService);

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
