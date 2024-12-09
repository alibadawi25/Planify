import React, { useState } from "react";
import { ConfigProvider } from 'antd';
import Header from "./Header";
import Body from "./Body";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState('tasks');

  const handleMenuClick = (view) => {
    setCurrentView(view);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 4,
        },
      }}
    >
      <div className="App">
        <Header onMenuClick={handleMenuClick} />
        <Body currentView={currentView} />
      </div>
    </ConfigProvider>
  );
}

export default App;
