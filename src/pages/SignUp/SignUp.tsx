import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const SignUp = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      countryCode: "+992",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('auth.usernameRequired', "Name is required")),
      email: Yup.string().email(t('auth.invalidEmail', "Invalid email")).required(t('auth.emailRequired', "Email is required")),
      phone: Yup.string()
        .matches(/^[0-9]+$/, t('auth.phoneNumbersOnly', "Phone number must contain only digits"))
        .min(7, t('auth.phoneMin', "Phone number must be at least 7 characters"))
        .max(15, t('auth.phoneMax', "Phone number must not exceed 15 characters"))
        .required(t('auth.phoneRequired', "Phone number is required")),
      password: Yup.string()
        .min(6, t('auth.passwordMin', "Password must be at least 6 characters"))
        .required(t('auth.passwordRequired', "Password is required")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], t('auth.passwordsMatch', 'Passwords must match'))
        .required(t('auth.confirmPasswordRequired', 'Confirm password is required')),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/Account/register`, {
          userName: values.name,
          email: values.email,
          phoneNumber: (values.countryCode || "+992") + values.phone,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        
        console.log(response.data);
        navigate('/login'); 
      } catch (err: unknown) {
        console.error(err);
        const error = err as { response?: { data?: { errors?: string[] | Record<string, string[]>, message?: string } }, message?: string };
        const errorMessage = error.response?.data?.errors 
          ? Object.values(error.response.data.errors).flat().join("\n")
          : t('auth.signupErrorDefault', "An error occurred during registration.");
        toast.error(t('auth.error', "Error: ") + errorMessage, { style: { background: '#333', color: '#fff' } });
      }
    },
  });

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-white dark:bg-zinc-900 font-sans text-zinc-900 dark:text-white px-[16px] py-[40px]">
      <div className="w-full max-w-[371px] flex flex-col items-center md:items-start">

        <h2 className="text-[36px] font-medium tracking-[1px] mb-[24px] text-center md:text-left">
          {t('auth.signupTitle')}
        </h2>

        <p className="text-[16px] text-zinc-900 dark:text-white font-normal mb-[48px] text-center md:text-left">
          {t('auth.signupSubtitle')}
        </p>

        <form className="w-full flex flex-col gap-[32px]" onSubmit={formik.handleSubmit}>

          <div className="flex flex-col gap-[4px] relative">
            <input
              type="text"
              name="name"
              placeholder={t('auth.username', 'Username')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`w-full border-b pb-[8px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${
                formik.touched.name && formik.errors.name ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-[4px] relative">
            <input
              type="text"
              name="email"
              placeholder={t('auth.email', 'Email')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full border-b pb-[8px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-[4px] relative">
            <div className={`w-full flex items-center border-b pb-[8px] transition-colors ${
              formik.touched.phone && formik.errors.phone ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus-within:border-zinc-900"
            }`}>
              <select
                name="countryCode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.countryCode || "+992"}
                className="bg-transparent text-[16px] text-zinc-900 dark:text-white outline-none pr-[8px] cursor-pointer font-medium"
              >
                <option value="+992">+992</option>
                <option value="+7">+7</option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder={t('auth.phone', 'Phone number')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="w-full text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none bg-transparent"
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">
                {formik.errors.phone}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[4px] relative">
            <input
              type="password"
              name="password"
              placeholder={t('auth.password', 'Password')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full border-b pb-[8px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${
                formik.touched.password && formik.errors.password ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.password}</span>
            )}
          </div>

          <div className="flex flex-col gap-[4px] relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder={t('auth.confirmPassword', 'Confirm Password')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`w-full border-b pb-[8px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
              }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.confirmPassword}</span>
            )}
          </div>

          <div className="flex flex-col gap-[16px] mt-[24px]">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-[#DB4444] text-white text-[16px] font-medium py-[16px] rounded-md hover:bg-[#C23B3B] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
            >
              {formik.isSubmitting ? t('auth.pleaseWait', 'Please wait...') : t('auth.createAccount', 'Create Account')}
            </button>

            <button
              type="button"
              className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[16px] font-normal py-[16px] border border-zinc-400 dark:border-zinc-700 rounded-md flex items-center justify-center gap-[16px] hover:bg-zinc-50 dark:bg-zinc-800 active:scale-[0.99] transition-all duration-200"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.934 11.934 0 0 0 12 0C7.305 0 3.23 2.536 1.055 6.273z"/>
                <path fill="#4285F4" d="M16.04 15.345c-1.013.682-2.34 1.091-4.04 1.091a7.042 7.042 0 0 1-6.732-4.955L1.136 14.69A11.94 11.94 0 0 0 12 24c3.245 0 6.19-1.077 8.44-2.918z"/>
                <path fill="#FBBC05" d="M5.268 11.482a6.953 6.953 0 0 1 0-2.964L1.136 5.31A11.957 11.957 0 0 0 0 12c0 2.455.44 4.805 1.24 6.982z"/>
                <path fill="#34A853" d="M23.523 9.818H12v4.545h6.636a5.684 5.684 0 0 1-2.463 3.727v3.01h3.986c2.332-2.146 3.673-5.305 3.673-9.01a11.536 11.536 0 0 0-.31-2.272z"/>
              </svg>
              {t('auth.signupGoogle', 'Sign up with Google')}
            </button>
          </div>
        </form>

        <div className="w-full flex items-center justify-center gap-[16px] mt-[32px] text-[16px]">
          <span className="text-zinc-500 dark:text-zinc-400">{t('auth.alreadyHaveAccount', 'Already have account?')}</span>
          <Link to="/login" className="font-medium text-zinc-900 dark:text-white border-b border-zinc-400 dark:border-zinc-700 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
            {t('auth.loginBtn', 'Log in')}
          </Link>
        </div>

      </div>
    </div>
  );
});

export default SignUp;