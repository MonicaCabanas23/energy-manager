export interface Aggregations {
    kwh: number;
    cost: number;
}

export interface PowerConsumptionGrouped {
    circuitId: number;
    _sum: Aggregations
}