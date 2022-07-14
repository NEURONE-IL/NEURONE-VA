import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  URI_Localhost: String = 'http://localhost:3000';
  URI_Servidor:String = 'va.neurone.info'
  constructor(public http: HttpClient) { }


  uploadImage(images: any) {
    const formData = new FormData();
    formData.append('file', images);

    return this.http.post<any>('http://localhost:3000/images', formData)
    // .subscribe(
    //   (res) => {
    //     return 'http://localhost:3000/images/' + res.fileName;
    //   },
    //   (err) => {
    //     console.log(err);
    //     return "noFile";
    //   }
    // );
  }

  deleteImage(imageName:string) {
    return this.http.delete<any>('http://localhost:3000/images/'+ imageName+'/delete')
  }

  getAllImagesServer(){
    return this.http.get<any>('http://localhost:3000/images/')
  }
}
