import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import Dropdown from './dropdown';
import "./dropdown-menu.css"


const DropDownMenu = () => {
    return (
        <div className='dropDownMenu'>
            <Dropdown title="Dropdown Menu 1">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
            </Dropdown>
            <Dropdown title="Dropdown Menu 2">
                <a href="#">Link A</a>
                <a href="#">Link B</a>
            </Dropdown>
            <Dropdown title="Dropdown Menu 3">
                <a href="#">Option 1</a>
                <a href="#">Option 2</a>
            </Dropdown>
            <Dropdown title="Dropdown Menu 4">
                <a href="#">Item 1</a>
                <a href="#">Item 2</a>
                <a href="#">Item 3</a>
            </Dropdown>
        </div>
    );
};

export default DropDownMenu;