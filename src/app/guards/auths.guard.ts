import { CanActivateFn } from "@angular/router";

export const AuthsGuard: CanActivateFn = (route, state) => {
  const storedData = localStorage.getItem("aminUserInfo");
  let pData = storedData ? JSON.parse(storedData) : null;
  let uiid = pData.user.uid;

  // const allowedIds = ['59','60','61']; // List of allowed login IDs
  // const userLoginId = uiid;

  // return ((allowedIds.includes(userLoginId) ? true : false));
  return true;
};
