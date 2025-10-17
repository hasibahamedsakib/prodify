import axios from "axios";
import type { AuthResponse } from "@/types";

const BASE_URL = "https://api.bitechx.com";

export const authApi = {
  login: async (email: string): Promise<AuthResponse> => {
    const response = await axios.post(`${BASE_URL}/auth`, { email });
    return response.data;
  },
};
