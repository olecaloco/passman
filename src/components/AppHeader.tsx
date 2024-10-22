const AppHeader = ({ onSignOut, handleShowPasswordForm }) => (
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl">Passman</h1>
            <button className="text-sm text-red-600 font-bold" onClick={onSignOut}>
                Sign Out
            </button>
        </div>
        <button className="px-2 py-1 text-sm border" onClick={handleShowPasswordForm}>
            Add Password
        </button>
    </div>
);

export default AppHeader;
