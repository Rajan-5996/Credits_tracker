/* eslint-disable react/prop-types */
// @ts-ignore
import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import DomoApi from "../API/domoAPI";

export interface UserContextType {
  currentUser: string;
  currentUserId: string;
  avatarKey: string;
  customer: string;
  host: string;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [avatarKey, setAvatarKey] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isUserFetched = false;

    DomoApi.GetCurrentUser().then((data: any) => {
      if (!isUserFetched) {
        const userId = data?.userId;
        const displayName = data?.displayName;
        const avatarKey = data?.avatarKey;
        const customer = data?.customer;
        const host = data?.host;

        setCurrentUser(displayName || "");
        setCurrentUserId(userId || "");
        setAvatarKey(avatarKey || "");
        setCustomer(customer || "");
        setHost(host || "");

        isUserFetched = true;
        setLoading(false);
      }
    });

    return () => {
      isUserFetched = true;
    };
  }, []);

  const value = useMemo(() => {
    return {
      currentUser,
      currentUserId,
      avatarKey,
      customer,
      host,
      loading,
    };
  }, [currentUser, currentUserId, avatarKey, customer, host, loading])

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  );
};
