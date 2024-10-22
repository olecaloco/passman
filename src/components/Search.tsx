const Search = ({ onQueryChange }) => (
    <input
        className="block mt-5 px-2 py-1 w-full border"
        type="text"
        onChange={onQueryChange}
        placeholder="Search label"
    />
);

export default Search;
