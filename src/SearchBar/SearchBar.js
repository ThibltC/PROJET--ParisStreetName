import React, { Component } from 'react';
import axios from 'axios'
import './SearchBar.css';
import { Link, Redirect } from 'react-router-dom';

class SearchBar extends Component {

    state = {
        input: '',
        result: [],
        autoCompDisplay: false,
        latitude: '',
        longitude: '',
        geolocplacename: '',
        onSubmitDisplay: false
    }


    // ********************** Geoloc *************************

    getLocation = () => {
        let geolocation = null;

        if (window.navigator && window.navigator.geolocation) { // essaye de récuperer les coordonnées géo depuis le navigateur
            geolocation = window.navigator.geolocation;
        }

        if (geolocation) { // les coordonées sont accessibles, on les stocke dans le state
            geolocation.getCurrentPosition(position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                if (this.state.latitude !== "" && this.state.longitude !== "") {
                    this.getPlace(this.state.latitude, this.state.longitude);
                }

            });
        }
    };

    getPlace = async (lat, lng) => { // interroge une API pour faire correspondre les coordonées à un nom d'endroit
        try {
            const response = await fetch(
                `https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${lat},%20${lng}&hitsPerPage=1&language=fr`
            );

            if (!response.ok) {
                throw Error(response.statusText);
            }

            const data = await response.json();
            console.log(data)
            await this.setState({ geolocplacename: data.hits[0].locale_names });
            this.setState({ input: this.state.geolocplacename })
        }
        catch (error) {
            console.log(error);
        }
    };
    // ******************* onChange ************************

    changeInput = async (event) => {
        await this.setState({
            input: event.target.value,
        })
        this.getData()
    };

    getData = () => {
        axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${this.state.input}`)
            .then(data => this.setState({
                result: data.data.records,
                autoCompDisplay: true,
            }))
    };

    // ******************** onClick **************************

    handleSubmit = (event) => {
        event.preventDefault()
        axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${event.target.elements.input.value}`)
            .then(res => this.setState({
                input: res.data.records[0].fields.typo,
                onSubmitDisplay: true
            }))
    };

    render() {

        if (this.state.onSubmitDisplay)
            return <Redirect to={`/${this.state.input}`} />

        return (


            <div className='searchBar' >

                <button type="button"
                    className="geoloc"
                    onClick={this.getLocation}
                >
                    Locate Me !
                </button>

                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="input"
                        placeholder="Ex: Rue Rivoli"
                        onChange={this.changeInput}
                        value={this.state.input}
                    />
                </form>

                <div className='AutoComp'>
                    {this.state.autoCompDisplay && this.state.result.length !== 0 && this.state.input.length !== 0 ?
                        <div className='autoCompValid'>
                            {this.state.result.map((el, i) =>
                                <div key={i} className='streetName'>
                                    <Link to={`/${el.fields.typo}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'black'
                                        }}>
                                        <p>{el.fields.typo}</p>
                                    </Link>
                                </div>
                            )}
                        </div>
                        :
                        <div className='noCorrespondence'>
                            {this.state.input &&
                                <p>Pas de correspondance</p>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    };
}


export default SearchBar;
