import axios from "axios";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

class LoginService {
    private api = axios.create({
        baseURL: process.env.QUASAR_APP_API_URL,
    });

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await this.api.post<LoginResponse>(
                "/login",
                credentials
            );
            return response.data;
        } catch (error) {
            throw new Error("Invalid username or password");
        }
    }

    storeToken(token: string): void {
        localStorage.setItem("token", token);
    }

    getToken(): string | null {
        return localStorage.getItem("token");
    }

    clearToken(): void {
        localStorage.removeItem("token");
    }
}

export default new LoginService();




