import React from 'react';
import { listTransformers, getTransformer, getTransformerName, GetTransformerRouterProps, postTransformer, postHadamardGate, postObservable, postTGate, postControlledNotGate } from './components/Transformer';
import { listChannels, getChannel, getChannelName, GetChannelRouterProps, FinalizeChannelRouterProps, TransformChannelRouterProps, postChannel, transformChannel, finalizeChannel} from './components/Channel';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteTransformer } from './apis/QuantumSimulator/Transformer';
import { deleteChannel } from './apis/QuantumSimulator/Channel';

export type RootStackParamList = {
  ListTransformers: undefined;
  GetTransformer: {
    id: number,
    name: string,
  };
  PostTransformer: undefined;
  PostObservable: undefined;
  PostHadamardGate: undefined;
  PostTGate: undefined;  
  PostControlledNotGate: undefined;
  ListChannels: undefined;
  GetChannel: {
    id: number,
    name: string,
  };
  PostChannel: undefined;
  FinalizeChannel: {
    id: number,
    name: string,
    qubitCount: number,
  };
  TransformChannel: {
    id: number,
    name: string,
    qubitCount: number,
    registerCount: number,
  };
};

const TransformersStack = createNativeStackNavigator();
function TransformersStackScreen() {  
  return (
    <TransformersStack.Navigator>
      <TransformersStack.Screen name="ListTransformers" component={listTransformers} options={({navigation}) => ({
        title: 'Transformers',
        headerRight: () => (
          <Button
            onPress={() => { 
              navigation.navigate('PostTransformer')
            }}
            title="Create"
          />
        )
      })}/>
      <TransformersStack.Screen name="GetTransformer" component={getTransformer} options={({navigation, route}) => ({
        title: getTransformerName(route as GetTransformerRouterProps),
        headerRight: () => (
          <Button
            onPress={() => {
              const getTransformerRoute = route as GetTransformerRouterProps
              deleteTransformer(getTransformerRoute.params.id)
              navigation.popToTop()
            }}
            title="Delete"
          />
        )
      })}/>
      <TransformersStack.Screen name="PostTransformer" component={postTransformer} options={{ title: "Create Transformer" }}/>
      <TransformersStack.Screen name="PostObservable" component={postObservable} options={{ title: "Observable" }}/>
      <TransformersStack.Screen name="PostHadamardGate" component={postHadamardGate} options={{ title: "Hadamard Gate" }}/>
      <TransformersStack.Screen name="PostTGate" component={postTGate} options={{ title: "T Gate" }}/>
      <TransformersStack.Screen name="PostControlledNotGate" component={postControlledNotGate} options={{ title: "Controlled-Not Gate" }}/>
    </TransformersStack.Navigator>
  );
}

const ChannelsStack = createNativeStackNavigator();
function ChannelsStackScreen() {  
  return (
    <ChannelsStack.Navigator>
      <ChannelsStack.Screen name="ListChannels" component={listChannels} options={({navigation}) => ({
        title: 'Channels',
        headerRight: () => (
          <Button
            onPress={() => { 
              navigation.navigate('PostChannel')
            }}
            title="Create"
          />
        )})
      }
      />
      <ChannelsStack.Screen name="GetChannel" component={getChannel} options={({navigation, route}) => ({
        title: `Detail ${getChannelName(route as GetChannelRouterProps)}`,
        headerRight: () => (
          <Button
            onPress={() => {
              const getChannelRoute = route as GetChannelRouterProps
              deleteChannel(getChannelRoute.params.id)
              navigation.popToTop()
            }}
            title="Delete"
          />
        )
      })}/>
      <ChannelsStack.Screen name="PostChannel" component={postChannel} options={{ title: "Create Channel" }}/>
      <ChannelsStack.Screen name="TransformChannel" component={transformChannel} options={({route}) => ({
          title: `Transform ${getChannelName(route as TransformChannelRouterProps)}`
      })}/>
      <ChannelsStack.Screen name="FinalizeChannel" component={finalizeChannel} options={({route}) => ({
          title: `Finalize ${getChannelName(route as FinalizeChannelRouterProps)}`
      })}/>
    </ChannelsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Transformers" component={TransformersStackScreen} options={{
          headerShown: false,
          tabBarIcon: (() => (<Icon name="cube" color="blue" size={25}/>))
        }}/>
        <Tab.Screen name="Channels" component={ChannelsStackScreen} options={{
          headerShown: false,
          tabBarIcon: (() => (<Icon name="cubes" color="blue" size={25}/>)),
        }}/>
      </Tab.Navigator>        
    </NavigationContainer>
  );
}
