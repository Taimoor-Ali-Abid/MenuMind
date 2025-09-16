import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {colors} from './src/constant';
import StackNavigation from './src/Navigation';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={colors.greenishBlue} />
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
