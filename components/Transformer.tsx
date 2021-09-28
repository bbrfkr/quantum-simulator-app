import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View, TouchableHighlight, ScrollView, TextInput, Button } from 'react-native';
import * as transformer from '../apis/QuantumSimulator/Transformer';
import { RootStackParamList } from '../App';
export type ListTransformersScreenProps = NativeStackScreenProps<RootStackParamList, 'ListTransformers'>;
export type GetTransformerScreenProps = NativeStackScreenProps<RootStackParamList, 'GetTransformer'>;
export type GetTransformerRouterProps = GetTransformerScreenProps['route'];
export type PostTransformerScreenProps = NativeStackScreenProps<RootStackParamList, 'PostTransformer'>;
export type PostObservableScreenProps = NativeStackScreenProps<RootStackParamList, 'PostObservable'>;
export type PostHadamardGateScreenProps = NativeStackScreenProps<RootStackParamList, 'PostHadamardGate'>;
export type PostTGateScreenProps = NativeStackScreenProps<RootStackParamList, 'PostTGate'>;
import { Slider, Icon } from 'react-native-elements';
import { MaxQubitCount, styles } from '../settings/Settings';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFocusEffect } from '@react-navigation/native';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function getTransformerName(route: GetTransformerRouterProps) {
  return route.params.name
}

export function listTransformers({navigation}: ListTransformersScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [transformersData, setTransformers] = useState([])

  const listTransformers = async () => {
    setTransformers((await transformer.listTransformers()).transformers)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    listTransformers()
    wait(1000).then(() => setRefreshing(false));
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      listTransformers()
    }, []
  ))

  return (
    <FlatList
      data={
        transformersData
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />    
      }
      keyExtractor={item => item.id.toString()}
      renderItem={
        ({item}: { item: transformer.ListedTransformer }) =>
        <TouchableHighlight
          onPress={() => navigation.navigate('GetTransformer', {id: item.id, name: item.name})}
        >
          <View style={styles.transformerView}>
            <View>
              <Text style={styles.name}>{item.name ? item.name : "<名前なし>"}</Text>
            </View>
            <View>
              <Text style={styles.id}>id: {item.id}</Text>
            </View>
          </View>
        </TouchableHighlight>
      }
    />
  );
}

export function getTransformer({route}: GetTransformerScreenProps) {
  const { id } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [transformerData, setTransformer ] = useState({} as transformer.GotTransformer)

  const getTransformer = async () => {
    setTransformer((await transformer.getTransformer(id)))
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTransformer()
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getTransformer()
  }, [])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />          
      }
    >
      <View>
        <Text style={styles.detail}>name: {transformerData.name ? transformerData.name : "<名前なし>"}</Text>
      </View>
      <View>
        <Text style={styles.detail}>id: {transformerData.id}</Text>
      </View>
      <View>
        <Text style={styles.detail}>type: {transformer.getType(transformerData)}</Text>
      </View>
      <View>
        <Text style={styles.detail}>matrix: {JSON.stringify(transformerData.matrix)}</Text>
      </View>
    </ScrollView>
  );
}

export function postTransformer({navigation}: PostTransformerScreenProps) {
  return (
    <FlatList
      data={[
        {
          "id": "Observable",
          "type": "Observable",
          "onPress": () => navigation.navigate("PostObservable"),
        },
        {
          "id": "Hadamard Gate",
          "type": "TimeEvolve",
          "onPress": () => navigation.navigate("PostHadamardGate"),
        },
        {
          "id": "T Gate",
          "type": "TimeEvolve",
          "onPress": () => navigation.navigate("PostTGate"),
        },
        {
          "id": "Controlled-Not Gate",
          "type": "TimeEvolve",
          "onPress": () => navigation.navigate("PostControlledNotGate"),
        },
      ]}
      keyExtractor={item => item.id.toString()}
      renderItem={
        ({item}) =>
        <TouchableHighlight
          onPress={item.onPress}
        >
          <View style={styles.transformerView}>
            <View>
              <Text style={styles.transformer_id}>{item.id}</Text>
            </View>
            <View>
              <Text style={styles.transformer_type}>{item.type}</Text>
            </View>
          </View>
        </TouchableHighlight>
      }
    />
  )
}

export function postObservable({navigation}: PostObservableScreenProps) {
  const [name, setName] = useState('')
  const [domainqubitCount, setDomainqubitCount] = useState(1)
  return (
    <View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={setName}
        />
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>domain qubits count</Text>
        <Slider
          value={domainqubitCount}
          style={{margin: 10}}
          minimumValue={1}
          maximumValue={MaxQubitCount}
          step={1}
          thumbStyle={{ height: 32, width: 32 }}
          thumbTintColor='lightblue'
          thumbProps={{
            children: (
              <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                <Icon type="font-awesome" name='microchip' color='white' size={20}/>
              </View>
            )
          }}
          onValueChange={setDomainqubitCount}
        />
        <Text style={{ textAlign: 'center' }}>{domainqubitCount}</Text>
      </View>
      <View style={{margin: 20}}>
        <Button title='Create' onPress={() => {
          transformer.postObservable(domainqubitCount, name)
          navigation.popToTop()
        }}/>
      </View>
    </View>
  )
}

export function postHadamardGate({navigation}: PostHadamardGateScreenProps) {
  const [name, setName] = useState('')
  const [targetQubit, setTargetQubit] = useState(0)
  const [domainqubitCount, setDomainqubitCount] = useState(1)

  return (
    <View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={setName}
        />
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>domain qubits count</Text>
        <Slider
          value={domainqubitCount}
          style={{margin: 10}}
          minimumValue={1}
          maximumValue={MaxQubitCount}
          step={1}
          thumbStyle={{ height: 32, width: 32 }}
          thumbTintColor='lightblue'
          thumbProps={{
            children: (
              <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                <Icon type="font-awesome" name='microchip' color='white' size={20}/>
              </View>
            )
          }}
          onValueChange={setDomainqubitCount}
        />
        <Text style={{ textAlign: 'center' }}>{domainqubitCount}</Text>
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>target qubit</Text>
        <ButtonGroup
          onPress={(index) => setTargetQubit(index)}
          selectedIndex={targetQubit}
          buttons={[...Array(domainqubitCount)].map((_, i) => (`${i}`))}
          selectedButtonStyle={{backgroundColor: 'lightblue'}}
          textStyle={{color: 'black'}}
          innerBorderStyle={{color: 'gray'}}
        />
      </View>
      <View style={{margin: 20}}>
        <Button title='Create' onPress={() => {
          transformer.postHadamardGate(targetQubit, domainqubitCount, name)
          navigation.popToTop()
        }}/>
      </View>
    </View>
  )
}

export function postTGate({navigation}: PostTGateScreenProps) {
  const [name, setName] = useState('')
  const [targetQubit, setTargetQubit] = useState(0)
  const [domainqubitCount, setDomainqubitCount] = useState(1)
  return (
    <View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={setName}
        />
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>domain qubits count</Text>
        <Slider
          value={domainqubitCount}
          style={{margin: 10}}
          minimumValue={1}
          maximumValue={MaxQubitCount}
          step={1}
          thumbStyle={{ height: 32, width: 32 }}
          thumbTintColor='lightblue'
          thumbProps={{
            children: (
              <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                <Icon type="font-awesome" name='microchip' color='white' size={20}/>
              </View>
            )
          }}
          onValueChange={setDomainqubitCount}
        />
        <Text style={{ textAlign: 'center' }}>{domainqubitCount}</Text>
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>target qubit</Text>
        <ButtonGroup
          onPress={(index) => setTargetQubit(index)}
          selectedIndex={targetQubit}
          buttons={[...Array(domainqubitCount)].map((_, i) => (`${i}`))}
          selectedButtonStyle={{backgroundColor: 'lightblue'}}
          textStyle={{color: 'black'}}
          innerBorderStyle={{color: 'gray'}}
        />
      </View>
      <View style={{margin: 20}}>
        <Button title='Create' onPress={() => {
          transformer.postTGate(targetQubit, domainqubitCount, name)
          navigation.popToTop()
        }}/>
      </View>
    </View>
  )
}

export function postControlledNotGate() {
  return (
    <Text>controlled-not gate</Text>
  )
}

