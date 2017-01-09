import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NavLink = props => (
    <Link {...props} activeClassName="active">{ props.children }</Link>
);

NavLink.propTypes = {
    children: PropTypes.string.isRequired,
};

module.exports = NavLink;
