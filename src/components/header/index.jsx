import * as React from 'react';
import { Button } from '@mui/material';
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
            <Button variant="outlined"  color='red' startIcon={<BsArrowLeftCircle />} onClick={handleClick}>
                Volver
            </Button>
        </div>  
        <div style={{ marginLeft:'-7rem' }}>
            <img src="/images/logo.jpg" alt="Logo Vaquero" style={{ width: '12rem', height:'12rem' }} />
            <hr />
        </div>
        <div />
    </div>
)}