export enum NotificationType {
    ERROR = 'Error',
    INFO = 'Info',
    UNKNOWN = "Unknown"
}

export type NotificationData = {
    id: number;
    message: string;
    type: NotificationType;
}

export type NotificationErrorDataDetails = {
    target?: string;
    message?: string;
}

export type NotificationErrorData = {
    code?: string;
    message?: string;
    details?: Array<NotificationErrorDataDetails>
}

export class NotificationDataBuilder {
    private notification : NotificationData | undefined;
    private obj? : any;

    constructor() {
        this.notification = {
            id: Math.random(),
            message: "Unknown",
            type: NotificationType.UNKNOWN
        }
    }

    public withObj(obj: any): NotificationDataBuilder {
        this.obj = obj;
        return this;
    }

    public withMessage(message: string): NotificationDataBuilder {
        this.notification!.message = message;
        return this;
    }

    public withType(type: NotificationType): NotificationDataBuilder {
        this.notification!.type = type;
        return this;
    }

    public build() : NotificationData {
        if (this.obj) {
            if (this.obj instanceof Error) {
                this.notification!.type = NotificationType.ERROR;
                if (this.notification!.message === "Unknown") {
                    this.notification!.message = (this.obj as Error).message;
                } else {
                    this.notification!.message += ": " + NotificationDataBuilder.parseError(this.obj as Error);
                }
            } else {
                if (this.notification!.message === "Unknown") {
                    this.notification!.message = this.obj.toString();
                } else {
                    this.notification!.message += ": " + this.obj.toString();
                }
            }
        }
        return this.notification!;
    }

    private static parseError(err: Error): string {
        // @ts-ignore
        if (err.response?.data) {
            // @ts-ignore
            const errorData: NotificationErrorData = err.response!.data as NotificationErrorData;
            let message = `${errorData.message} ` || '';
            if (errorData.details && errorData.details.length > 0) {
                message += `${errorData.details[0].target} ${errorData.details[0].message}`
            }
            return message;
        } else {
            return err.message;
        }

    }
}