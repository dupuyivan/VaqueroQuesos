import React from "react"
import { Autocomplete, TextField } from "@mui/material"

export default function SelectClient ({ options, onChange }) {
    const renderInput = params => <TextField {...params} label="Busca o elige un cliente" />

return (
    <Autocomplete
        onChange={(_, newVal) => onChange(newVal)}
        disablePortal
        options={options}
        getOptionLabel={(option) => option.Nombre}
        getOptionKey={(option) => option.$id}
        renderInput={renderInput}
        sx={{ width: 600 }}
    />
) }