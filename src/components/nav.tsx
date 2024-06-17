import React, { useState } from "react";
import { BottomNavigation, Icon, useNavigate } from "zmp-ui";


const Navigation: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");

  const handleChange = (key: string) => {
    setActiveTab(key);
    if (key === 'mission') {
      navigate('/');
    } else if (key === 'calendar') {
      navigate('/calendar');
    } else if (key === 'me') {
      navigate('/info');
    }
  };

  return (
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={(key) => handleChange(key)}
    >
      <BottomNavigation.Item
        key="mission"
        label="Nhiệm vụ"
        icon={<Icon icon="zi-list-1" />}
      />
      <BottomNavigation.Item
        label="Lịch"
        key="calendar"
        icon={<Icon icon="zi-calendar" />}
        activeIcon={<Icon icon="zi-calendar-solid" />}
      />
      <BottomNavigation.Item
        key="me"
        label="Cá nhân"
        icon={<Icon icon="zi-user" />}
        activeIcon={<Icon icon="zi-user-solid" />}
      />
    </BottomNavigation>
  );
};

export default Navigation;