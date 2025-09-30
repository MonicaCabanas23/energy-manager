export interface CreateOrUpdateSensor {
    id ?: number|null;
    name: string;
    doublePolarity: boolean;
    panelId: number;
}