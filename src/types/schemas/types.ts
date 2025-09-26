export interface ISensor {
    name            : string;
    double_polarity : boolean;
    status         ?: string;
    latest_value   ?: number;
}