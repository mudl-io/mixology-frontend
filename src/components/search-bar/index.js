import React from "react";
import AsyncSelect from "react-select/async";

const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <AsyncSelect
        cacheOptions
        styles={props.styles}
        placeholder={props.placeholder || "Search..."}
        loadOptions={props.loadOptions}
        onInputChange={props.handleChange}
        onChange={props.handleSelect}
      />
    </div>
  );
};

export default SearchBar;
