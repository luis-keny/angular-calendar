import { Type } from "@angular/core";

export interface ModalConfig {
    title?: string;
    component: Type<any>;
    alertMessage?: string;
    data?: any;
}