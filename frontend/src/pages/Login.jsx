function Login() {
  return (
    <div className="max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input className="border p-2 w-full mb-3" placeholder="Email" />
      <input className="border p-2 w-full mb-3" placeholder="Password" type="password"/>

      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Login
      </button>

    </div>
  );
}

export default Login;