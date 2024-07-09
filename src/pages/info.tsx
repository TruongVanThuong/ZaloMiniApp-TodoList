import React from "react";
import { List, Page, Icon, useNavigate } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

import UserCard from "../components/user-card";
import { Chart } from 'react-google-charts';

const Info: React.FunctionComponent = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];
  const options = {
    title: "My Daily Activities",
  };


  return (
    <Page className="page">
      <div className="section-container">
        <UserCard user={user.userInfo} />
      </div>
      <div className="section-container">
        <List>
          <List.Item
            onClick={() => navigate("/about")}
            suffix={<Icon icon="zi-arrow-right" />}
          >
            <div>About</div>
          </List.Item>
          <List.Item
            onClick={() => navigate("/user")}
            suffix={<Icon icon="zi-arrow-right" />}
          >
            <div>User</div>
          </List.Item>
        </List>
      </div>
      <div>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
        // width={"100%"}
        // height={"400px"}
        />
      </div>

    </Page>
  );
};

export default Info;