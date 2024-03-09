import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TwitchAuthorized } from './types';

@Injectable({
    providedIn: 'root',
})
export class TcsService {
    authorized = signal<TwitchAuthorized | undefined>(undefined);

    private MEDIATOR_ORIGIN = 'http://localhost:8088/suggestion';

    constructor(private http: HttpClient) {
        window.Twitch.ext.onAuthorized((auth: TwitchAuthorized) => {
            console.log(auth);
            this.authorized.set(auth);
        });
    }

    sendCodeSuggestion(code: string) {
        console.log('sending code suggestion', code);

        const token = window.Twitch.ext.viewer.sessionToken;
        if (!token) {
            return;
        }
        return firstValueFrom(
            this.http.post(
                this.MEDIATOR_ORIGIN,
                {
                    code,
                    twitchId: window.Twitch.ext.viewer.opaqueId,
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            )
        );
    }
}
