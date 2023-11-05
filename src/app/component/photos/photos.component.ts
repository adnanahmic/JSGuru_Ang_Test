import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PostsService } from 'src/app/services/posts.service';
import { MatPaginator } from '@angular/material/paginator';
import { Constants } from 'src/app/utils/constants';
import { Photo } from 'src/app/interfaces/photo.interface';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/popup/popup/popup.component';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
})
export class PhotosComponent {
  columnsToDisplay: string[] = Constants.columnsToDisplayPhotos;
  paginationOptions = Constants.paginationOptions;
  dataSource = new MatTableDataSource<Photo>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private postService: PostsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPhotos(0, 5);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private getPhotos(start: number, limit: number) {
    this.postService.getPhotos({ start, limit }).subscribe((res) => {
      this.dataSource.data = res || [];
      this.paginator.length = Constants.photosTotalRecords;
    });
  }

  public onPaginateChange(event: any) {
    const prevPaginationData = this.paginator;
    if (prevPaginationData.pageIndex !== event.pageIndex) {
      this.paginator.pageIndex = event.pageIndex;
    } else if (prevPaginationData.pageSize !== event.pageSize) {
      this.paginator.pageSize = event.pageSize;
    }

    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const limit = this.paginator.pageSize;
    this.getPhotos(start, limit);
  }

  public openPopUp(url: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { url: url },
    });
  }
}
