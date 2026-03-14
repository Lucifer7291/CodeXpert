function SignUp() {
  return (
    <div className="max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Signup</h1>

      <input className="border p-2 w-full mb-3" placeholder="Name"/>
      <input className="border p-2 w-full mb-3" placeholder="Email"/>
      <input className="border p-2 w-full mb-3" placeholder="Password" type="password"/>

      <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Create Account
      </button>

    </div>
  );
}

export default SignUp;