import { useEffect, useState } from "react";
import { Password } from "../models";
import { supabase as client, supabase } from "../Supabase";

const PasswordsList = ({ query }) => {
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [passwords, setPasswords] = useState<Password[]>([]);

    useEffect(() => {
        let proceed = true;
        client
            .from("passwords")
            .select("id, label, username, password")
            .eq("user_id", supabase.auth.user()?.id)
            .then(({ data }) => {
                if (!proceed) return;

                const result = data as unknown as Password[];
                setLoading(false);
                setPasswords(result);
            });

        return () => {
            proceed = false;
        };
    }, []);

    useEffect(() => {
        let proceed = true;
        const subscription = client
            .from("passwords")
            .on("INSERT", (payload) => {
                if (!proceed) return;

                const item: Password = {
                    id: payload.new.id,
                    label: payload.new.label,
                    username: payload.new.username,
                    password: payload.new.password,
                    createdAt: payload.new.createdAt,
                    updatedAt: payload.new.updatedAt,
                };
                setPasswords((p) => [...p, item]);
            })
            .subscribe();

        return () => {
            proceed = false;
            client.removeSubscription(subscription);
        };
    }, []);

    useEffect(() => {
        if (!copiedId) return;

        let proceed = true;

        const timeout = setTimeout(() => {
            if (!proceed) return;
            setCopiedId(null);
        }, 2000);

        return () => {
            proceed = false;
            clearTimeout(timeout);
        };
    }, [copiedId]);

    useEffect(() => {
        let proceed = true;

        const searchLabels = async () => {
            try {
                const { data, error } = await client
                    .from("passwords")
                    .select("id, label, username, password")
                    .ilike("label", `%${query}%`)
                    .eq("user_id", client.auth.user()?.id);

                if (error) throw error;

                if (!proceed) return;
                const result = data as unknown as Password[];
                setPasswords(result);
            } catch (e) {
                console.error(e);
            }
        };

        searchLabels();

        return () => {
            proceed = false;
        };
    }, [query]);

    const onCopy = async (item: Password) => {
        await window.navigator.clipboard.writeText(item.password ?? "");
        setCopiedId(item.id);
    };

    return (
        <table className="w-full mt-5">
            <thead>
                <tr>
                    <th className="text-sm text-left">Label</th>
                    <th className="text-sm ">Username</th>
                    <th className="text-sm text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading && (
                    <tr>
                        <td className="p-2 text-center text-sm bg-blue-400 text-white" colSpan={3}>
                            Loading...
                        </td>
                    </tr>
                )}
                {passwords.map((password) => (
                    <tr key={password.id}>
                        <td className="py-2 text-sm">{password.label}</td>
                        <td className="py-2 text-sm text-center">{password.username}</td>
                        <td className="py-2 text-sm text-right">
                            <button
                                className={`px-2 py-1 w-16 text-sm rounded ${
                                    copiedId === password.id ? "bg-green-300" : "bg-gray-200"
                                }`}
                                onClick={() => onCopy(password)}
                            >
                                {copiedId === password.id ? "Copied" : "Copy"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PasswordsList;
