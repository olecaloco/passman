export enum Views {
    LOGIN = "login",
    REGISTER = "register",
    APP = "app",
}

export interface Password {
    id: number;
    user_id?: string;
    label: string;
    username?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}
