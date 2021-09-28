import axios from 'axios';
import { QuantumSimulatorProtocol, QuantumSimulatorHost, QuantumSimulatorPort } from '../../settings/Settings';

export const client = axios.create({
    baseURL: `${QuantumSimulatorProtocol}://${QuantumSimulatorHost}:${QuantumSimulatorPort}`,
    headers: {'Content-Type': 'application/json'},
    responseType: 'json',
});
