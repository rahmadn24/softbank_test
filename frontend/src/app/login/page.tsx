"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    // Kirim kredensial (username, password) ke backend untuk mendapatkan token
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token; // Token yang diterima dari backend

      // Simpan token di localStorage
      localStorage.setItem("token", token);

      // Redirect ke halaman dashboard setelah login berhasil
      router.push("/");
    } else {
      // Tampilkan error jika login gagal
      const errorData = await response.json();
      setError(errorData.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div>
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full p-2 bg-blue-500 text-white rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
