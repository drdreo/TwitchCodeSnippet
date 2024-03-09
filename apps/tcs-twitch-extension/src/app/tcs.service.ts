import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TcsService {
    constructor(private http: HttpClient) {}

    sendCodeSuggestion(code: string) {
        console.log('sending code suggestion', code);
        console.log(window.Twitch.ext.viewer);

        return firstValueFrom(
            this.http.post('http://localhost:8088/suggestion', {
                code,
                twitchId: window.Twitch.ext.viewer.opaqueId,
            })
        );
    }
}
