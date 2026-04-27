import * as react_jsx_runtime from 'react/jsx-runtime';

interface SigninComponentProps {
    backendUrl: string;
    redirectUrl?: string;
}
declare function SigninComponent({ backendUrl, redirectUrl }: SigninComponentProps): react_jsx_runtime.JSX.Element;

interface SignupComponentProps {
    backendUrl: string;
}
declare function SignupComponent({ backendUrl }: SignupComponentProps): react_jsx_runtime.JSX.Element;

export { SigninComponent as Signin, SignupComponent as Signup };
