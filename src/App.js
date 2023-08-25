
import { Button, theme, ConfigProvider } from 'antd';
import { Main } from './components';
import { useState } from 'react'

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme;


const App = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);


  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return <ConfigProvider
    theme={{
      hashed: false,
      algorithm: [isDarkMode ? darkAlgorithm : defaultAlgorithm, compactAlgorithm],
      token: {
        "fontFamily": "'Lato', sans-serif",
        "colorPrimary": "#f88a24",
        "fontSize": 16,
        "borderRadius": 8,
        "wireframe": true,
        "colorPrimaryBg": "#2fc1ff",
      }

    }
    }
  >
    <Main />

    <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 10000 }}>
      <Button type='text' onClick={handleClick}>
        {isDarkMode ? "Light" : "Dark"}
      </Button>
    </div>
  </ConfigProvider>
};

export default App;