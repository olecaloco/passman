import { ChangeEvent, FC, FormEvent, MouseEventHandler, useState } from "react";
import { Views } from "../models";
import { supabase as client } from "../Supabase";

interface Props {
    onAuthViewChange: MouseEventHandler;
    view: Views;
}

const AuthForm: FC<Props> = ({ view, onAuthViewChange }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [values, setValues] = useState({ email: "", password: "" });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((v) => ({ ...v, [name]: value }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            if (loading) return;

            if (!values.email || !values.password) throw new Error("Auth Form values invalid!");

            setLoading(true);
            let error: Error | null = null;

            if (view === Views.LOGIN) {
                const response = await client.auth.signIn({ email: values.email, password: values.password });
                if (response.error) error = response.error;
            } else if (view === Views.REGISTER) {
                const response = await client.auth.signUp({ email: values.email, password: values.password });
                if (response.error) error = response.error;
            }

            if (error) throw error;
        } catch (e) {
            const error = e as Error;
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <form className="flex align-center justify-center flex-col w-full h-full" onSubmit={onSubmit}>
            {error && <div className="mb-3 p-2 bg-red-100 text-red-600">{error}</div>}
            <div className="mb-3">
                <label className="inline-block mb-2 text-sm">Email</label>
                <input
                    className="block border w-full px-2 py-1"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    value={values.email}
                    onChange={onChange}
                    autoComplete="off"
                    required
                />
            </div>
            <div className="relative mb-3">
                <label className="inline-block mb-2 text-sm">Password</label>
                <input
                    className="block border w-full px-2 py-1"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={onChange}
                    autoComplete="off"
                    required
                />
                <button
                    className="absolute top-9 right-2 text-sm rounded text-gray-400"
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <div>
                <button type="button" onClick={onAuthViewChange}>
                    {view === Views.LOGIN ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
            </div>
            <button
                className="block mt-5 p-2 bg-blue-400 rounded w-full capitalize text-white"
                type="submit"
                disabled={loading}
            >
                {view}
            </button>
        </form>
    );
};

export default AuthForm;
