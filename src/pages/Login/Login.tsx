import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginSuccess } from "../../store/authSlice";
import toast from "react-hot-toast";
import { axiosRequest, saveToken } from "../../utils/token";
import { useTranslation } from "react-i18next";

const Login = memo(() => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(t('auth.usernameRequired', 'Username is required')),
      password: Yup.string().required(t('auth.passwordRequired', 'Password is required')),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosRequest.post(`/Account/login`, {
          userName: values.userName,
          password: values.password,
        });
        const token = response.data?.data;
        if (token) {
          saveToken(token);
          dispatch(loginSuccess(token));
        } else {
          console.warn("Токен аз сервер ёфт нашуд!");
        }
        navigate("/");
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response?.data?.errors
          ? error.response.data.errors.join("\n")
          : t('auth.invalidLogin', 'Invalid login or password.');
        toast.error(t('auth.loginError', 'Login error: ') + errorMessage, { style: { background: '#333', color: '#fff' } });
      }
    },
  });

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-white dark:bg-zinc-900 font-sans text-zinc-900 dark:text-white px-[16px] py-[40px]">
      <div className="w-full max-w-[371px] flex flex-col items-center md:items-start">
        <h2 className="text-[36px] font-medium tracking-[1px] mb-[24px] text-center md:text-left">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-[16px] text-zinc-900 dark:text-white font-normal mb-[48px] text-center md:text-left">
          {t('auth.loginSubtitle')}
        </p>
        <form className="w-full flex flex-col gap-[32px]" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-[4px] relative">
            <input
              type="text"
              name="userName"
              placeholder={t('auth.username', 'Username')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              className={`w-full border-b pb-[8px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${formik.touched.userName && formik.errors.userName ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
                }`}
            />
            {formik.touched.userName && formik.errors.userName && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.userName}</span>
            )}
          </div>

          <div className="flex flex-col gap-[4px] relative">
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('auth.password', 'Password')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full border-b pb-[8px] pr-[40px] text-[16px] placeholder:text-zinc-400 dark:text-zinc-500 outline-none transition-colors ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-zinc-400 dark:border-zinc-700 focus:border-zinc-900"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-500 text-[12px] absolute -bottom-[20px] left-0">{formik.errors.password}</span>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start gap-[16px] mt-[24px]">
            <Link
              to="/forgot-password"
              className="text-[#DB4444] text-[16px] font-medium hover:underline transition-all"
            >
              {t('auth.forgotPassword')}
            </Link>

            <button
              type="submit"
              className="w-full bg-[#DB4444] text-white text-[16px] font-medium py-[16px] rounded-md hover:bg-[#C23B3B] active:scale-[0.99] transition-all duration-200"
            >
              {t('auth.loginBtn')}
            </button>
          </div>
        </form>

        <div className="w-full flex items-center justify-center gap-[16px] mt-[32px] text-[16px]">
          <span className="text-zinc-500 dark:text-zinc-400">{t('auth.noAccount')}</span>
          <Link to="/signup" className="font-medium text-zinc-900 dark:text-white border-b border-zinc-400 dark:border-zinc-700 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
            {t('auth.signupBtn')}
          </Link>
        </div>

      </div>
    </div>
  );
});

export default Login;