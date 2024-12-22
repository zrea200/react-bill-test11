import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import sum from '@/test';
const a = sum(1, 2);
console.log(a);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);

