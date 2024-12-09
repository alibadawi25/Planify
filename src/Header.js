import React from 'react';
import { Dropdown, Menu, Divider, Typography, FloatButton } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import "./Header.css";

const { Title } = Typography;

const Header = ({ onMenuClick }) => {
  // Function to handle menu item click
  const handleMenuClick = (e) => {
    onMenuClick(e.key); // Pass the selected menu item key to the parent component
  };

  // Dropdown menu for hover options
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="tasks">Tasks</Menu.Item>
      <Menu.Item key="calendar">Calendar</Menu.Item>
    </Menu>
  );

  return (
    <div className="header-container">
      <div className="header-title">
        <Title className="titles">Planify</Title>
      </div>

      {/* Floating Button with Dropdown */}
      <Dropdown overlay={menu} trigger={['hover']}>
        <FloatButton
          icon={<MenuOutlined />}
          shape="circle"
          type="primary"
          style={{ position: 'absolute', top: 32, right: 24 }}
        />
      </Dropdown>

      <Divider style={{ borderWidth: '2px' }} />
    </div>
  );
};

export default Header;
