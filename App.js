import * as React from 'react';
import {useEffect} from 'react';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import {Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import MainTabScreen from './screens/MainTabScreen';
import SettingsScreen from './screens/SettingsScreen';
import RootStackScreen from './screens/RootStackScreen';

import { DrawerContent } from './screens/DrawerContent';
import {AuthContext} from './components/context';
const Drawer = createDrawerNavigator();




function App() {
 {/*const [isLoading, setIsLoading] = React.useState(true);
 const [userToken, setUserToken] = React.useState(null);*/}

 const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
 };

 const loginReducer = (prevState, action) => {
    switch( action.type ) {
        case 'RETRIEVE_TOKEN':
            return{
                ... prevState,
                userToken: action.token,
                isLoading: false
            };
        case 'LOGIN':
            return{
                ... prevState,
                userName: action.id,
                userToken: action.token,
                isLoading: false};
        case 'LOGOUT':
            return{
                ... prevState,
                userName: null,
                userToken: null,
                isLoading: false};
        case 'REGISTER':
            return{
                ... prevState,
                userName: action.id,
                userToken: action.token,
                isLoading: false};
    }
 };

 const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

 const authContext = React.useMemo(() => ({
    signIn: async(foundUser) => {
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;
            try{
                userToken = 'abcd';
                await AsyncStorage.setItem('userToken', userToken);
            } catch(e) {
                console.log(e);
            }
        dispatch({ type: 'LOGIN', id: userName, token: userToken});
    },
    signOut: async() => {
            try{
              await AsyncStorage.removeItem('userToken');
            } catch(e) {
              console.log(e);
            }
        dispatch({ type: 'LOGOUT'});
    },
    signUp: () => {

    },
 }));

 useEffect(() => {
    setTimeout(async() => {
        //setIsLoading(false);
        let userToken;
        userToken = null
        try{
            userToken = await AsyncStorage.getItem('userToken');
        } catch(e) {
            console.log(e);
        }
        dispatch({ type: 'RETRIEVE_TOKEN', token: userToken});
    },2500);
 }, []);

 if( loginState.isLoading ) {
    return(
        <View style={{flex:1,justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large"/>
        </View>
    )
 }

 return (
   <AuthContext.Provider value={authContext}>
   <NavigationContainer>
       { loginState.userToken !== null ? (
         <Drawer.Navigator drawerContent={props => <DrawerContent { ... props} />}>
           <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
           <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
           {/*<Drawer.Screen name="Details" component={DetailsStackScreen} />*/}
         </Drawer.Navigator>
        )
        :
        <RootStackScreen/>
        }
    </NavigationContainer>
    </AuthContext.Provider>
  );
}
export default App;

{/*
     <Stack.Navigator
       screenOptions={{
       headerStyle: {
         backgroundColor: '#277248',
       },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
        <Stack.Screen name="Home" component={HomeScreen}
         options={{ headerLeft: () => (
             <Icon.Button
                name="menu"
                backgroundColor="#277248"
                size={25}
                onPress={() => alert('This is a button!')}
                color="#fff"
              />
            ),
           headerTitle: props => <LogoTitle {...props} />,
           headerTitleAlign: 'center',
           headerRight: props => <GoToSearch {...props} />
          }} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>*/}