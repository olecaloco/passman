import { ChangeEvent, FormEvent, useState } from "react";
import { generate } from "generate-password";
import { supabase as client } from "../Supabase";

const AddPasswordForm = ({ handleClosePasswordForm }) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        label: "",
        username: "",
        password: "",
    });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((v) => ({ ...v, [name]: value }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            if (loading) return;
            if (!values.label || !values.password) return;

            setLoading(true);

            await client.from("passwords").insert([
                {
                    user_id: client.auth.user()?.id,
                    label: values.label,
                    username: values.username,
                    password: values.password,
                },
            ]);

            handleClosePasswordForm();
        } catch (e) {
            console.error(e);
        }
    };

    const onGeneratePassword = () => {
        const generatedPassword = generate({
            length: 12,
            strict: true,
        });
        setValues((v) => ({ ...v, password: generatedPassword }));
    };

    return (
        <div className="fixed flex items-center justify-center top-0 left-0 z-10 w-full h-full bg:opacity-50">
            <div
                className="absolute z-20 top-0 left-0 w-full h-full bg-gray-800 opacity-75"
                onClick={handleClosePasswordForm}
            ></div>
            <form
                className="relative z-30 p-4 w-full h-full md:w-96 md:h-auto max-w-full rounded bg-white"
                onSubmit={onSubmit}
            >
                <div className="mb-3">
                    <label className="inline-block mb-2 text-sm">Label</label>
                    <input
                        className="block w-full border px-2 py-1"
                        name="label"
                        type="text"
                        value={values.label}
                        placeholder="Enter label"
                        autoComplete="off"
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="inline-block mb-2 text-sm">Username</label>
                    <input
                        className="block w-full border px-2 py-1"
                        name="username"
                        type="text"
                        value={values.username}
                        placeholder="Enter username (optional)"
                        autoComplete="off"
                        onChange={onChange}
                    />
                </div>
                <div className="mb-10">
                    <label className="inline-block mb-2 text-sm">Password</label>
                    <div className="flex items-center">
                        <input
                            className="block w-full border px-2 py-1"
                            name="password"
                            value={values.password}
                            type="text"
                            placeholder="Enter Password"
                            autoComplete="off"
                            onChange={onChange}
                            required
                        />
                        <button className="ml-2 px-2 py-1 border" type="button" onClick={onGeneratePassword}>
                            Generate
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <button className="mr-5 text-sm" type="button" onClick={handleClosePasswordForm}>
                        Cancel
                    </button>
                    <button className="bg-blue-400 text-sm text-white border p-2">Add Password</button>
                </div>
            </form>
        </div>
    );
};

export default AddPasswordForm;
