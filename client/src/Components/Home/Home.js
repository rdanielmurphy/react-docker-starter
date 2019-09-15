import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './Home.css';
import StaticDataService from '../../Services/StaticDataService';
import { makeStyles } from '@material-ui/core/styles';


const classes = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: '20px'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '300px'
    },
    griditem: {
        padding: '25px'
    }
}));

class HomeComponent extends Component {
    componentDidMount() {
        this.setState({ data: StaticDataService.getData() });
    }

    goToItem(id) {
        this.props.history.push('/item/' + id)
    }

    createGrid = () => {
        let grid = [];

        if (this.state && this.state.data) {
            for (let key in this.state.data) {
                const dataItem = this.state.data[key];
                grid.push(
                    <Grid key={dataItem.id} item xs={6} sm={3} className={classes.griditem}>
                        <Paper onClick={() => { this.goToItem(dataItem.id) }} className="paper">{dataItem.name}</Paper>
                    </Grid>
                )
            }
        }

        return grid;
    }

    render() {
        return (
            <div className="home-container">
                <Grid container spacing={3}>
                    {this.createGrid()}
                </Grid>
            </div >
        )
    }
}

export default HomeComponent;