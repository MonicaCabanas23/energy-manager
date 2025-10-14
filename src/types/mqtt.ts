export interface MqttMessagePayload {
  topic          : string;
  circuitName    : string;
  doublePolarity : boolean;
  message        : string;
  timestamp      : string;
}