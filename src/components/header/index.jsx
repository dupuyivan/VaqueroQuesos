import * as React from 'react';
import { IconButton } from '@mui/material';
import { BsArrowLeftCircle } from "react-icons/bs";
import { useHistory } from "react-router";

export default function Header () {
    const history = useHistory();

    const handleClick = () => {
        history.goBack()
    }

return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
            <IconButton aria-label="back" size="large" onClick={handleClick}>
                <BsArrowLeftCircle />        
            </IconButton>
        </div>  
        <div style={{ marginLeft:'-4rem' }}>
            <img src="/images/logo.jpg" alt="Logo Vaquero" style={{ width: '12rem', height:'12rem' }} />
            <hr />
        </div>
        <div />
    </div>
)}