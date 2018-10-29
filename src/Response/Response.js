import React, { Component } from 'react';
import './Response.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Share, MoreHoriz, YoutubeSearchedFor } from '@material-ui/icons';
import { Button, CardMedia, CardContent, CardActions, Typography } from '@material-ui/core';


const styles = theme => ({
    media: {
        height: 210,
    },
});

class Response extends Component {

    state = {
        dataInfos: undefined,
        infoDisplay: false,
        originName: '',
        openInfo: false,
    }

    componentDidMount() {
        axios
            .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${this.props.match.params.typo}`)
            .then(data => this.setState({
                dataInfos: data.data.records[0].fields,
                infoDisplay: true,
                originName: data.data.records[0].fields.histo.split('~')[1]
            }))
    }

    moreInfo = () => {
        this.setState({ openInfo: !this.state.openInfo });
    };

    render() {
        console.log(this.state.dataInfos)
        const { classes } = this.props

        return (
            <div className='Response'>
                {this.state.infoDisplay &&
                    <div>
                        {console.log(`../Images/Paris_${this.state.dataInfos.arron.split(',')[0]}.jpg`)}
                        <CardMedia
                            className={classes.media}
                            image={require(`../Images/Paris_${this.state.dataInfos.arron.split(',')[0]}.jpg`)}
                            title="image Paris arron"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h1">
                                {this.state.dataInfos.typo.replace(this.state.dataInfos.typo.charAt(0), this.state.dataInfos.typo.charAt(0).toUpperCase())}
                            </Typography>
                            <Typography component="h2">
                                {this.state.originName.replace(/(Monuments classés.|Historique.)/, '')}
                            </Typography>
                            {/Historique/g.test(this.state.dataInfos) &&
                                <Typography component="h2">
                                    {this.state.dataInfos.histo.split('~').replace(/(Monuments classés.|Historique.)/, '')}
                                </Typography>
                            }
                            {this.state.openInfo &&
                                <Typography component="h3" className='fadein'>
                                    {this.state.dataInfos.texte}
                                </Typography>
                            }
                        </CardContent>
                        <CardActions >
                            <Button>
                                <Share />
                            </Button>
                            <Button onClick={this.moreInfo}>
                                <MoreHoriz />
                            </Button>
                            <Link to='/' >
                                <Button>
                                    <YoutubeSearchedFor />
                                </Button>
                            </Link>
                        </CardActions>
                    </div>
                }
            </div>

        )
    }
}

export default withStyles(styles)(Response);
