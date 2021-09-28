import { StyleSheet } from "react-native";
import {QUANTUM_SIMULATOR_HOST, QUANTUM_SIMULATOR_PORT, QUANTUM_SIMULATOR_PROTOCOL} from '@env';

export const QuantumSimulatorProtocol = QUANTUM_SIMULATOR_PROTOCOL;
export const QuantumSimulatorHost = QUANTUM_SIMULATOR_HOST;
export const QuantumSimulatorPort = QUANTUM_SIMULATOR_PORT;
export const MaxQubitCount = 6
export const MaxRegistersCount = 6

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50
    },
    transformerView: {
      backgroundColor: 'black',
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    channelView: {
      backgroundColor: 'black',
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      },  
    name: {
      fontSize: 30,
      color: 'white',
    },
    id: {
      fontSize: 20,
      color: 'lightblue',
    },
    transformer_id: {
      fontSize: 30,
      color: 'white',
    },
    transformer_type: {
      fontSize: 20,
      color: 'lightblue',
    },
    detail: {
      fontSize: 20,
      color: 'black',
    },
    input: {
      height: 40,
      margin: 10,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
    },
    field: {
      height: 40,
      margin: 12,
      padding: 10,
    },
  });
  