import React from "react";

import "./Button.scss";

import classNames from "classnames";

import sprite from "../../assets/sprite.svg";

const Button = ({ title = "", img, spriteID, disabled, onClick }) => (
  <button
    className={classNames("button", {
      "button--img": img,
    })}
    disabled={disabled}
    onClick={onClick}
  >
    {title && <span>{title}</span>}
    {img && (
      <svg>
        <use href={sprite + `${spriteID}`}></use>
      </svg>
    )}
  </button>
);

export default Button;
