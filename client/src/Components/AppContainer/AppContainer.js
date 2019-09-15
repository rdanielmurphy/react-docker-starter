import React, { Component } from 'react';
import './AppContainer.css';
import NavBar from '../NavBar/NavBar';
import { Switch, Route } from 'react-router-dom';
import StaticDataService from '../../Services/StaticDataService';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProfileComponent from '../Profile/Profile';
import HomeComponent from '../Home/Home';
import ItemBrowser from '../ItemBrowser/ItemBrowser';

class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        StaticDataService.loadData().then(() => {
            this.setState({ loaded: true });
        });
    }

    render() {
        return (
            <div className="app-container">
                <NavBar></NavBar>
                {this.state.loaded ?
                    (
                        <Switch>
                            <Route path="/profile" component={ProfileComponent} />
                            <Route path="/home" component={HomeComponent} />
                            <Route path="/item/:id" component={ItemBrowser} />
                            <Route component={HomeComponent} path='*' />
                        </Switch>
                    ) : (
                        <div className="loading">
                            <h2> Loading ... </h2>
                            <CircularProgress size={100} />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default AppContainer;