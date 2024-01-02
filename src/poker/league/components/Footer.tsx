import React from "react";
import '../style/league.css'
import {VERSION} from '../../utils/constants';

const Footer = () => {
  return (
    <div className={'shim'}>
      <p>V{VERSION}</p>
    </div>
  )
}

export default Footer