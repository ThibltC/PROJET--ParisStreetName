import React, { Component } from 'react';
import './App.css';


class Image extends Component {
    render() {
        const { arron } = this.props
        let image = require(`./Images/Paris_${arron}.jpg`)
        return (
            <div className="Image">
                <img src={image} alt='img' />
            </div>
        );
    }
}

export default Image;
