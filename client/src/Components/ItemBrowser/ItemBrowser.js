import React, { Component } from 'react';
import './ItemBrowser.css';
import StaticDataService from '../../Services/StaticDataService';

class ItemBrowser extends Component {
    render() {
        const { id } = this.props.match.params;
        const item = StaticDataService.getData()[id];
        return (
            <div>
                <h4>Name: {item.name} </h4>
            </div>
        );
    }
}

export default ItemBrowser;