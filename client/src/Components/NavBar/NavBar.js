import React, { Component } from 'react';
import AuthService from '../../Services/AuthService';
import './NavBar.css';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LeftDrawer from '../LeftDrawer/LeftDrawer';
import Backdrop from '../Backdrop/Backdrop';
import Button from '@material-ui/core/Button';

const menuId = 'primary-search-account-menu';

class NavBar extends Component {
    state = {
        drawerOpen: false,
        openpopover: false
    };

    constructor(props) {
        super(props);
        this.profileRef = React.createRef();
    }

    toggleDrawer(open) {
        this.setState({
            drawerOpen: open
        });
    };

    componentDidMount() {
        const userDto = AuthService.getUserDto();
        this.setState({ userName: userDto.displayName });
    }

    handleClick = (e) => {
        this.setState({ drawerOpen: false });
    }

    backdropClick = () => {
        this.setState({ drawerOpen: false });
    }

    handleProfileMenuOpen = (event) => {
        this.setState({ openpopover: true });
    }

    handleProfileMenuClose = (event) => {
        this.setState({ openpopover: false });
    }

    getRef = () => {
        if (this.profileRef) {
            return this.profileRef.current;
        }

        return "";
    }

    render() {
        let backdrop;
        if (this.state.drawerOpen) {
            backdrop = <Backdrop click={this.backdropClick}></Backdrop>;
        }

        return (
            <div>
                <div className="grow">
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton className="menu-button" color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer(!this.state.drawerOpen)}>
                                <MenuIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" color="inherit" className="grow">
                                Test App
                            </Typography>
                            <IconButton
                                ref={this.profileRef}
                                fontSize="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit">
                                <div className="user-name">{this.state.userName}</div>
                                <AccountCircle />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>
                <LeftDrawer show={this.state.drawerOpen}></LeftDrawer>
                {backdrop}
                <Popover
                    open={this.state.openpopover}
                    anchorEl={this.getRef()}
                    onClose={this.handleProfileMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}>
                    <Button color="primary" className="popover-item" component={Link} to="/profile">
                        <Typography variant="h6" color="inherit" className="grow">Profile</Typography>
                    </Button>
                    <br></br>
                    <Button color="primary" className="popover-item" component={Link} to="/logout">
                        <Typography variant="h6" color="inherit" className="grow">Log out</Typography>
                    </Button>
                </Popover>
            </div>
        );
    }
}

export default NavBar;