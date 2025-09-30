export interface CreateOrUpdateSensor {
    id ?: number;
    code: string;
    name: string;
    doublePolarity: boolean;
    panelId: number;
}