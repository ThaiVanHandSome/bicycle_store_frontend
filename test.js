
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
    private readonly hostServer = environment.hostServer
    private readonly host = this.hostServer + '/redirect'
  
    constructor (private readonly http: HttpClient) { }

    get(toUrl: string): Observable<any> {
        // Gửi một HTTP GET request tới endpoint `/redirect` với tham số `to`
        return this.http.get<any>(`${this.hostServer}/redirect?to=${toUrl}`);
    }
}