import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    try {
      await AuthService.register(email, password, name);
      navigate('/profile');
      window.location.reload();
    } catch (err: any) {
      setError(err as string);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border">
        <h2 className="text-2xl font-bold text-center text-primary-800 mb-6">ثبت نام در فراشان مدیا</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل یا شماره همراه</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <input 
              type="password" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تکرار رمز عبور</label>
            <input 
              type="password" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition">
            ثبت نام
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">قبلا ثبت نام کرده‌اید؟ </span>
          <Link to="/login" className="text-primary-600 font-bold hover:underline">وارد شوید</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;