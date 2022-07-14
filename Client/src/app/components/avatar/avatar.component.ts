import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @Input() message:string |String | undefined;
  @Input() avatarImage:string |String| undefined;
  

  constructor() { }

  ngOnInit(): void {
  }

}
