import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import Dropdown from './dropdown';
import "./dropdown-menu.css"


const DropDownMenu = () => {
    return (
        <div className='dropDownMenu'>
            <Dropdown title="Dropdown Menu 3" category="season">
            </Dropdown>
            <Dropdown title="Dropdown Menu 2" category="leagues">
            </Dropdown>
            <Dropdown title="Dropdown Menu 1" category="clubs">
            </Dropdown>
            <form>
                <label>
                    <input type="radio" name="option" value="club">
                        Club Teams
                    </input>
                </label>
                <label>
                    <input type="radio" name="option" value="national">
                        National Teams
                    </input>
                </label>
                <label>
                    <input type="radio" name="option" value="both" checked>
                        Both
                    </input>
                </label>
            </form>
        </div>
    );
};

export default DropDownMenu;