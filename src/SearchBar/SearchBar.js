import React, { Component } from 'react';
import axios from 'axios'
import './SearchBar.css';
import Image from '../Image';
import { Route, Switch } from 'react-router-dom';

class SearchBar extends Component {

    state = {
        input: '',
        result: [],
        dataInfos: undefined,
        autoCompDisplay: false,
        infoDisplay: false,
        // monumentsClasses: undefined,
        // historique: undefined,
        latitude: "",
        longitude: "",
        geolocplacename: "",
    }

    getPlace = async (lat, lng) => { // interroge une API pour faire correspondre les coordonées à un nom d'endroit
        try {
            const response = await fetch(
                `https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${lat},%20${lng}&hitsPerPage=1&language=fr`
            );

            if (!response.ok) {
                throw Error(response.statusText);
            }

            const data = await response.json();
            await this.setState({ geolocplacename: data.hits[0].locale_names });
            this.setState({ input: this.state.geolocplacename })
        }
        catch (error) {
            console.log(error);
        }
    };

    getLocation = e => {
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

    getData = () => {
        axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${this.state.input}`)
            .then(data => this.setState({
                result: data.data.records,
                autoCompDisplay: true,
                infoDisplay: false
            }))
    };

    getInfo = () => {
        axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${this.state.input}`)
            .then(data => this.setState({
                dataInfos: data.data.records[0].fields,
                autoCompDisplay: false,
                infoDisplay: true
            }))
            this.props.arron(this.state.dataInfos.arron.replace(/,.+/,''))
    }

    inputChange = async (event) => {
        await this.setState({
            input: event.target.value
        })
        this.getData()
    }

    // monumentsClasses = () => {
    //     if (/Monu.+~/g.test(this.state.dataInfos.histo)) {
    //         this.setState({
    //             monumentsClasses: this.state.dataInfos.histo.match(/M.+~\s(.+\.)/gm),
    //             // dataInfos: this.state.dataInfos.histo.replace(/M.+~\s(.+\.)/gm,'')
    //         })
    //     }
    //     if (/Histo.+~/g.test(this.state.dataInfos.histo)) {
    //         this.setState({
    //             historique: this.state.dataInfos.histo.match(/H.+~\s(.+\.)/gm),
    //             // dataInfos: this.state.dataInfos.histo.replace(/H.+~\s(.+\.)/gm,'')
    //         })
    //     }
    // }

    completeInput = async (event) => {
        const fillWith = await event.target.innerHTML;
        await this.setState({
            input: fillWith,
        })
        await axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${fillWith}`)
            .then(data => this.setState({
                dataInfos: data.data.records[0].fields,
                autoCompDisplay: false,
                infoDisplay: true
            }))
            
        // this.monumentsClasses()
    }

    clearState = () => {
        this.setState({
            input: '',
            result: [],
            dataInfos: undefined,
            autoCompDisplay: false,
            infoDisplay: false,
            monumentsClasses: undefined,
            historique: undefined,
        })
    }


    render() {
        // console.log(this.state.input)
        console.log(this.state.result)
        // console.log(this.state.dataInfos)

        return (
            <div className='searchBar'>
                <form autoComplete="off" >
                    <input
                        type="text"
                        name="input"
                        placeholder="Ex: Rue Rivoli"
                        onChange={this.inputChange}
                        value={this.state.input}
                    />
                    <button
                        type="button"
                        onClick={this.clearState}
                    >
                        Clear
                    </button>
                    <button type="button" className="geoloc" onClick={this.getLocation}>
                        Locate Me !
                    </button>
                </form>
                {this.state.autoCompDisplay && this.state.result.length !== 0 && this.state.input.length !== 0 ?
                    <div className='autoComp'>
                        {this.state.result.map((el, i) =>
                            <div key={i} className='streetName'>
                                <p onClick={this.completeInput} >{el.fields.typo}</p>
                            </div>
                        )}
                    </div>
                    :
                    <div className='noCorrespondence'>
                        {(!this.state.dataInfos && this.state.input) &&
                            <p>Pas de correspondance</p>
                        }
                    </div>
                }
                <Switch>
                    {this.state.infoDisplay &&
                        <div className='info'>
                            <h2>{this.state.dataInfos.histo}</h2>
                            <h3>{this.state.dataInfos.texte}</h3>
                            {this.state.dataInfos.arron
                                .split(',')
                                .map((arron, id) =>
                                    <Image arron={arron} key={id} />
                                )}
                        </div>
                    }
                </Switch>
            </div>
        )
    }
}

export default SearchBar;