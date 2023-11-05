import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Constants } from 'src/app/utils/constants';
import { Post } from 'src/app/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts.service';
import { Comment } from 'src/app/interfaces/comment.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HomeComponent {
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = Constants.columnsToDisplayPosts;
  paginationOptions = Constants.paginationOptions;
  expandedElement!: Post | null;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    /* 
    to create proper json for single row
    call 3 api's at a time
    */
    combineLatest([
      this.postService.getPosts(),
      this.postService.getUsers(),
      this.postService.getComments(),
    ]).subscribe(async (res) => {
      if (res[0] && res[1] && res[2]) {
        const posts = res[0];
        const users = res[1];
        const comments = res[2];
        const postsData = [];
        for (let index = 0; index < posts.length; index++) {
          const post = posts[index];
          for (let index = 0; index < users.length; index++) {
            const user = users[index];
            if (post.userId === user.id) {
              const res = this.filterCommentsByPost(post.id, comments);
              postsData.push({
                ...post,
                author: user.name,
                comments: res,
              });
              this.dataSource.data = postsData;
            }
          }
        }
      }
    });
  }

  // getting the comments of filter according to post
  private filterCommentsByPost(postId: number, comments: Comment[]): Comment[] {
    const filteredComments = comments.filter((comment: Comment) => {
      if (comment.postId === postId) {
        return comment;
      } else {
        return;
      }
    });
    return filteredComments;
  }

  public applyFilter(event: any): void {
    let filterValue = event.target.value.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.author.toLowerCase().includes(filter);
    };
  }

  public toggleDropdown(element: any) {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
    }
  }
}
