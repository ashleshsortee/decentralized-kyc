import React from 'react';

const Header = function (props) {
  return (
    <div className="header">
      {props.heading}
    </div>
  )
}

export default Header;