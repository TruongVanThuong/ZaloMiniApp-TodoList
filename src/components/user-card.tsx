import React from "react";
import { GetUserInfoReturns } from "zmp-sdk";
import { Avatar, Box, Text } from "zmp-ui";

interface UserProps {
  user: GetUserInfoReturns["userInfo"];
}
import { useRecoilValue } from "recoil";
import { displayNameState } from "../state";

const UserCard: React.FunctionComponent<UserProps> = ({ user }) => {
  const displayName = useRecoilValue(displayNameState);
  return (
    <Box flex>
      <Avatar
        story="default"
        online
        src={user.avatar.startsWith("http") ? user.avatar : undefined}
      >
        {user.avatar}
      </Avatar>
      <Box ml={4}>
        <Text.Title>{displayName || user.name}</Text.Title>
        <Text>{user.id}</Text>
      </Box>
    </Box>
  );
};

export default UserCard;