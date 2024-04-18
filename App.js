import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Navigation />
    </ApplicationProvider>
  );
}
