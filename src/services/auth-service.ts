interface LoginResponse {
  message: string;
  token: string;
}

interface LoginError {
  error: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${process.env.BACKEND_URI}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as LoginError).error || "Login failed");
  }

  return data as LoginResponse;
};

export const getUser = async () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return null;
  }

  return token;
};
