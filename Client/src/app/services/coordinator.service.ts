import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {
  evs: EventSource;
  apiUrl = environment.apiUrl;

  constructor(private _zone: NgZone) {
    this.evs = new EventSource('');
   }
   
  //SSE
  //Crear objeto EventSource
  createEventSource(url: string) {
    this.evs = this.getEventSource(url);
  }

  //Añadir un listener SSE
  addListener(event: string) {
    return new Observable((observer) => {
      this.evs.addEventListener(event, (e) => {
        this._zone.run(() => {
          observer.next(e);
        });
      });
    });
  }

  //Crear conexión SSE
  private getEventSource(url: string): EventSource {
    return new EventSource(this.apiUrl + url);
  }

  //Cerrar conexión SSE
  stopExchangeUpdates() {
    this.evs.close();
  }
}
