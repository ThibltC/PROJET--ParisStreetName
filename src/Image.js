import React, { Component } from 'react';


class Image extends Component {
    render() {

        const { arron } = this.props
        console.log(arron)
        let image = require(`./Images/Paris_${arron}.jpg`)
        console.log(`Paris_${arron}.jpg`)
        return (
            <div className="Image">
                <img src={image} alt='img' />
            </div>
        );
    }
}

export default Image;
