interface SubscriptionStatus {
    tier: string;
}

interface Window {
    Twitch: {
        ext: {
            onAuthorized: (callback: (auth: TwitchAuthorized) => void) => void;
            onContext: (callback: (context: any) => void) => void;
            viewer: {
                opaqueId: string;
                helixToken: string;
                sessionToken: string;
                subscriptionStatus: SubscriptionStatus | null; // subscriptionStatus will be null if the user is either not a subscriber, or opting not to share their identity. The value will also be null if the extension otherwise doesn’t have subscription capabilities.
                role: string;
                id: string | null;
                isLinked: boolean;
                onChanged: (callback: () => void) => void;
            };
        };
    };
}
