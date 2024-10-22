import { ChangeEvent, useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import Search from "./components/Search";
import AddPasswordForm from "./containers/AddPasswordForm";
import AuthForm from "./containers/AuthForm";
import PasswordsList from "./containers/PasswordsList";
import { debounce } from "./helpers";
import { Views } from "./models";
import { supabase as client } from "./Supabase";

const App = () => {
    const [view, setView] = useState<Views | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!client) return;

        const refreshToken = window.localStorage.getItem("refreshToken");
        if (refreshToken) {
            client.auth.signIn({ refreshToken }).then(({ error }) => {
                if (error) {
                    window.localStorage.removeItem("refreshToken");
                    setView(Views.LOGIN);
                }
            });
        } else {
            setView(Views.LOGIN);
        }
    }, []);

    useEffect(() => {
        if (!client) return;

        client.auth.onAuthStateChange((_, session) => {
            if (session) {
                window.localStorage.setItem("refreshToken", session.refresh_token ?? "");
                setView(Views.APP);
            } else {
                window.localStorage.removeItem("refreshToken");
                setView(Views.LOGIN);
            }
        });
    }, []);

    const onAuthViewChange = () => {
        if (view === Views.LOGIN) {
            setView(Views.REGISTER);
        } else if (view === Views.REGISTER) {
            setView(Views.LOGIN);
        }
    };

    const onQueryChange = debounce(async (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, 350);

    const onSignOut = async () => {
        await client.auth.signOut();
    };

    return (
        <main id="app">
            <div className="container mx-auto max-w-xl mt-5 px-4">
                {(view === Views.LOGIN || view === Views.REGISTER) && (
                    <AuthForm view={view} onAuthViewChange={onAuthViewChange} />
                )}
                {view === Views.APP && (
                    <>
                        {showPasswordForm && (
                            <AddPasswordForm handleClosePasswordForm={() => setShowPasswordForm(false)} />
                        )}

                        <AppHeader onSignOut={onSignOut} handleShowPasswordForm={() => setShowPasswordForm(true)} />
                        <Search onQueryChange={onQueryChange} />
                        <PasswordsList query={query} />
                    </>
                )}
            </div>
        </main>
    );
};

export default App;
