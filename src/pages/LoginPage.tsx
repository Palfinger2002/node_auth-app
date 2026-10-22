import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';

import { usePageError } from '../hooks/usePageError';
import { useAuth } from '../components/AuthContext';
import { AxiosError } from 'axios';

function validateName(name: string) {
  const trimmedName = name.trim();

  const nameRegex =
    /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ]+([ '’\-][a-zA-Zа-яА-ЯіІїЇєЄґҐ]+)*$/;

  if (!trimmedName) {
    return 'Name is required';
  }

  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return 'At least 2 characters and no more than 50 characters';
  }

  return nameRegex.test(trimmedName) ? undefined : 'Name is not valid';
}

const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

function validateEmail(email: string) {
  if (!email) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Email is not valid';
  }
}

function validatePassword(password: string) {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'At least 6 characters';
  }
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = usePageError('');
  const { login, isChecked, currentUser } = useAuth();

  if (isChecked && currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        validateOnMount={true}
        onSubmit={({ name, email, password }) => {
          return login(name, email, password)
            .then(() => {
              const state = location.state as { from?: Location };

              navigate(state.from?.pathname ?? '/');
            })
            .catch((err: AxiosError<{ message?: string }>) => {
              setError(err.response?.data?.message ?? '');
            });
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="box">
            <h1 className="title">Log in</h1>
            <div className="field">
              <label htmlFor="name" className="label">
                Name
              </label>

              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateName}
                  name="name"
                  type="text"
                  id="name"
                  placeholder="e.g. Bob Smith"
                  className={cn('input', {
                    'is-danger': touched.name && errors.name,
                  })}
                />

                <span className="icon is-small is-left">
                  <i className="fa fa-user"></i>
                </span>

                {touched.name && errors.name && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>

              {touched.name && errors.name && (
                <p className="help is-danger">{errors.name}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>

              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  placeholder="e.g. bobsmith@gmail.com"
                  className={cn('input', {
                    'is-danger': touched.email && errors.email,
                  })}
                />

                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>

                {touched.email && errors.email && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>

              {touched.email && errors.email && (
                <p className="help is-danger">{errors.email}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>

              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="*******"
                  className={cn('input', {
                    'is-danger': touched.password && errors.password,
                  })}
                />

                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>

                {touched.password && errors.password && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>

              {touched.password && errors.password ? (
                <p className="help is-danger">{errors.password}</p>
              ) : (
                <p className="help">At least 6 characters</p>
              )}
            </div>
            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', {
                  'is-loading': isSubmitting,
                })}
                disabled={isSubmitting || !!errors.email || !!errors.password}
              >
                Log in
              </button>
            </div>
            Do not have an account? <Link to="/sign-up">Sign up</Link>
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </>
  );
};
