import { AppRegistry, YellowBox } from 'react-native';
import Navigation from './app/navigation'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'ViewPagerAndroid']);

AppRegistry.registerComponent('rethink', () => Navigation);
