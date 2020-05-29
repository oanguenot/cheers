import * as Sentry from "@sentry/browser";

export const initializeTracker = async () => {
    try {
        Sentry.init({ dsn: "https://f2f2f802df014db2a77a286ccdd8529b@o188291.ingest.sentry.io/5257535" });
    } catch (err) {
        console.error("[tracking] can't start tracker", err);
    }
};

export const trackError = (error, errorInfo) => {
    try {
        Sentry.withScope((scope) => {
            Object.keys(errorInfo).forEach((key) => {
                scope.setExtra(key, errorInfo[key]);
            });
            Sentry.captureException(error);
        });
    } catch (err) {
        console.error("[tracking]", "can't track issue", err);
    }
};
