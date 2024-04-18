import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainView from './MainView';
import QuestionView from './QuestionView';
import SettingsView from './SettingsView';
import StatsView from './StatsView';

export default function Navigation() {

    const { Navigator, Screen } = createStackNavigator();

    return(
        <NavigationContainer>
            <Navigator initialRouteName='Main Menu' >
                <Screen name='Main Menu' component={MainView} />
                <Screen name='Question' component={QuestionView} />
                <Screen name='Settings' component={SettingsView} />
                <Screen name='Stats' component={StatsView} />
            </Navigator>
        </NavigationContainer>
    );
}