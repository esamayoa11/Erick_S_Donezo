import axios from "axios";
import supabase from "./client";

const getAxiosClient = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Current session:", session);
  console.log("Access token:", session?.access_token);

  const instance = axios.create({
    baseURL: "http://localhost:8080", // Set baseURL
    headers: {
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
  });

  return instance;
};

export default getAxiosClient;
