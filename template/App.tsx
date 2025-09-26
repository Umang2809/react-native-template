import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Main from './Main';
import { ThemeProvider } from './src/hooks/ThemeContext';
const queryClient = new QueryClient()
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Main />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
