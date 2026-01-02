import React from "react";

const PlayerNameInput = ({
                             value,
                             onChange,
                             placeholder = "Enter your name",
                             maxLength = 32,
                             className,
                         }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <input
            type="text"
            value={value}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={handleChange}
            className={className}
        />
    );
};

export default PlayerNameInput;
