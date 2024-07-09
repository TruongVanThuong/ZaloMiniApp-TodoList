
import { atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "normal",
    }),
});

export const displayNameState = atom({
  key: "displayName",
  default: localStorage.getItem('displayName') || "", // Lấy giá trị từ localStorage hoặc sử dụng chuỗi rỗng nếu không có
});

