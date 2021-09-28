import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Button, Text, View, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import * as channel from '../apis/QuantumSimulator/Channel';
import * as transformer from '../apis/QuantumSimulator/Transformer';
import { RootStackParamList } from '../App';
export type ListChannelsScreenProps = NativeStackScreenProps<RootStackParamList, 'ListChannels'>;
export type GetChannelScreenProps = NativeStackScreenProps<RootStackParamList, 'GetChannel'>;
export type GetChannelRouterProps = GetChannelScreenProps['route'];
export type PostChannelScreenProps = NativeStackScreenProps<RootStackParamList, 'PostChannel'>;
export type TransformChannelScreenProps = NativeStackScreenProps<RootStackParamList, 'TransformChannel'>;
export type TransformChannelRouterProps = TransformChannelScreenProps['route'];
export type FinalizeChannelScreenProps = NativeStackScreenProps<RootStackParamList, 'FinalizeChannel'>;
export type FinalizeChannelRouterProps = FinalizeChannelScreenProps['route'];
import { Slider, Icon, ButtonGroup } from 'react-native-elements'
import { styles, MaxRegistersCount, MaxQubitCount } from '../settings/Settings';
import { ListedTransformer } from '../apis/QuantumSimulator/Transformer';
import DropDownPicker from 'react-native-dropdown-picker';
import { string } from 'mathjs';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function getChannelName(route: GetChannelRouterProps | FinalizeChannelRouterProps | TransformChannelRouterProps) {
  return route.params.name
}

export function listChannels({navigation}: ListChannelsScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [channelsData, setChannels] = useState([])

  const listChannels = async () => {
    setChannels((await channel.listChannels()).channels)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    listChannels()
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
    listChannels()
    }, []
  ))
  
  return (
    <FlatList
      data={
        channelsData
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />          
      }
      keyExtractor={item => item.id.toString()}
      renderItem={
        ({item}: { item: channel.ListedChannel }) =>
        <TouchableHighlight
          onPress={() => navigation.navigate('GetChannel', {id: item.id, name: item.name})}
        >
          <View style={styles.channelView}>
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

export function getChannel({navigation, route}: GetChannelScreenProps) {
  const { id } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [channelData, setChannel ] = useState({} as channel.GotChannel)

  const getChannel = async () => {
    setChannel((await channel.getChannel(id)))
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getChannel()
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      getChannel()
    }, [])
  )

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
        <Text style={styles.detail}>name: {channelData.name ? channelData.name : "<名前なし>"}</Text>
      </View>
      <View>
        <Text style={styles.detail}>id: {channelData.id}</Text>
      </View>
      <View>
        <Text style={styles.detail}>qubit_count: {channelData.qubit_count}</Text>
      </View>
      <View>
        <Text style={styles.detail}>register_count: {channelData.register_count}</Text>
      </View>
      <View>
        <Text style={styles.detail}>init_transformer_ids: {JSON.stringify(channelData.init_transformer_ids)}</Text>
      </View>
      <View>
        <Text style={styles.detail}>state_ids: {JSON.stringify(channelData.state_ids)}</Text>
      </View>
      <View>
        <Text style={styles.detail}>transformer_ids: {JSON.stringify(channelData.transformer_ids)}</Text>
      </View>
      <View>
        <Text style={styles.detail}>outcome: {channelData.outcome == null ? "<not finalized>" : channelData.outcome}</Text>
      </View>
      <View style={{margin: 20}}>
        <Button title='Initialize' onPress={() => {
          channel.initializeChannel(id)
          onRefresh()
        }}
        disabled={channelData.state_ids == null ? false : (channelData.state_ids.length != 0)}
      />
      </View>
      <View style={{margin: 20}}>
        <Button title='Transform' onPress={() => {
          navigation.navigate('TransformChannel', { id: route.params.id, name: route.params.name, qubitCount: channelData.qubit_count, registerCount: channelData.register_count })
        }}
        disabled={!(channelData.state_ids == null ? false : (channelData.state_ids.length != 0)) || (channelData.outcome == undefined ? false : true)}
      />
      </View>
      <View style={{margin: 20}}>
        <Button title='Finalize' onPress={() => {
          navigation.navigate('FinalizeChannel', { id: route.params.id, name: route.params.name, qubitCount: channelData.qubit_count })
        }}
        disabled={!(channelData.state_ids == null ? false : (channelData.state_ids.length != 0)) || (channelData.outcome == undefined ? false : true)}
      />
      </View>
    </ScrollView>
  );
}

export function postChannel({navigation}: PostChannelScreenProps) {
  const [name, setName] = useState('')
  const [qubitCount, setQubitCount] = useState(1)
  const [registersCount, setRegistersCount] = useState(1)
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
        <Text style={{margin: 10}}>qubits count</Text>
        <Slider
          value={qubitCount}
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
          onValueChange={setQubitCount}
        />
        <Text style={{ textAlign: 'center' }}>{qubitCount}</Text>
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>registers count</Text>
        <Slider
          value={registersCount}
          style={{margin: 10}}
          minimumValue={1}
          maximumValue={MaxRegistersCount}
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
          onValueChange={setRegistersCount}
        />
        <Text style={{ textAlign: 'center' }}>{registersCount}</Text>
      </View>
      <View style={{margin: 20}}>
        <Button title='Create' onPress={() => {
          channel.postChannel(qubitCount, registersCount, [], name)
          navigation.popToTop()
        }}/>
      </View>
    </View>
  )
}



export function transformChannel({navigation, route}: TransformChannelScreenProps) {
  const [targetRegister, setTargetRegister] = useState()
  const [allTransformers, setAllTransformers] = useState([] as ListedTransformer[])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(0)

  const listTransformers = async () => {
    setAllTransformers((await transformer.listTransformers()).transformers)
  }

  const transformerItems = (allTransformers: ListedTransformer[]) => {
    const extractedList = [] as ListedTransformer[];
    for (const transformer of allTransformers) {
      //TODO Qubit Countをapiで返して、このチャネルに有効なtransformerだけ返す
      extractedList.push(transformer);
    }
    const extractedItems = extractedList.map((transformer) => ({label: (transformer.name == "" ? `<名前なし> id:${transformer.id}` : `${transformer.name} id:${transformer.id}`), value: transformer.id}))
    return extractedItems
  }

  useFocusEffect(
    useCallback(() => {
      listTransformers()
    }, [])
  )

  return (
    <View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>available transformers</Text>
        <DropDownPicker
          items={transformerItems(allTransformers)}
          value={value}
          open={open}
          setOpen={setOpen}
          setValue={setValue}
        />
      </View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>register index</Text>
        <ButtonGroup
          onPress={(index) => {
            if (index == targetRegister) {
              setTargetRegister(undefined)
            } else {
              setTargetRegister(index)
            }
          }}
          selectedIndex={targetRegister}
          buttons={[...Array(route.params.registerCount)].map((_, i) => (`${i}`))}
          selectedButtonStyle={{backgroundColor: 'lightblue'}}
          textStyle={{color: 'black'}}
          innerBorderStyle={{color: 'gray'}}
        />
      </View>
      <View style={{margin: 20}}>
        <Button title='Transform' onPress={() => {
          channel.transformChannel(route.params.id, value, targetRegister)
          navigation.pop()
        }}/>
      </View>
    </View>
  )
}

export function finalizeChannel({navigation, route}: FinalizeChannelScreenProps) {
  const [targetQubits, setTargetQubits] = useState([])
  return (
    <View>
      <View style={{margin: 10}}>
        <Text style={{margin: 10}}>target qubit(s)</Text>
        <ButtonGroup
          onPress={(indexes) => setTargetQubits(indexes)}
          selectedIndexes={targetQubits}
          buttons={[...Array(route.params.qubitCount)].map((_, i) => (`${i}`))}
          selectedButtonStyle={{backgroundColor: 'lightblue'}}
          textStyle={{color: 'black'}}
          innerBorderStyle={{color: 'gray'}}
          selectMultiple={true}
        />
      </View>
      <View style={{margin: 20}}>
        <Button title='Finalize' onPress={() => {
          channel.finalizeChannel(route.params.id, targetQubits)
          navigation.pop()
        }}/>
      </View>
    </View>
  )
}
