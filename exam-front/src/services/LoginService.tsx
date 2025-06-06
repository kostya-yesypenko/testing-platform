import { urlBase } from "../consts";

export const signup = async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => {
    // Step 1: Create the user
    const userResponse = await fetch(`${urlBase}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
  
    if (!userResponse.ok) {
      const error = await userResponse.text();
      throw new Error(`Signup failed: ${error}`);
    }
  
    // Step 2: Log in the user
    const loginResponse = await fetch(`${urlBase}/generate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username, // assuming login uses `username`, not email
        password
      })
    });
  
    if (!loginResponse.ok) {
      throw new Error("Login after signup failed");
    }
  
    const json = await loginResponse.json();
  
    const token = json.token;
    if (token) {
      localStorage.setItem("token", token);
    }
  
    const userId = json.user.id;
    localStorage.setItem("userId", userId);
  
    return json;
  };
  

export const login = async ({ username, password }: { username: string, password: string }) => {
    const response = await fetch(`${urlBase}/generate-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    if (!response.ok) {
        throw new Error("Login failed");
    }    

    const json = await response.json();

    const token = json.token;
    if (token) {
        localStorage.setItem("token", token);
    }

    const userId = json.user.id;
    localStorage.setItem("userId", userId);

    return json;
}