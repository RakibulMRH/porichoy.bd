'use client';

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Password Reset Successful</h2>
          <p className="mb-4">
            Your password was successfully reset. You can now login with your new password.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => window.location.href = '/login'}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}