import * as React from 'react';
import { IconButton } from '@mui/material';
import { BsArrowLeftCircle } from "react-icons/bs";
import { useHistory } from "react-router";

export default function Header ({ pageName }) {
    const history = useHistory();

    const handleClick = () => {
        history.goBack()
    }

return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
            <IconButton size="large" className='sales-pageName' onClick={handleClick}>
                <BsArrowLeftCircle />        
            </IconButton>
        </div>  

        <div style={{ width: '100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginLeft:'-5rem' }}>
            <img src='/images/logo.jpg' alt="Logo Vaquero" style={{ width: '14rem', height:'12rem' }} />
            <div className="contenedor__titulo">
                <h2>{pageName}</h2>
                <hr />
            </div>
        </div>
    </div>
)}