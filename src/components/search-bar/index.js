import AsyncSelect from "react-select/async";
import _ from "lodash";

const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <AsyncSelect
        cacheOptions
        placeholder={props.placeholder || "Search..."}
        loadOptions={props.loadOptions}
        onInputChange={props.handleChange}
        onChange={props.handleSelect}
      />
    </div>
  );
};

export default SearchBar;
