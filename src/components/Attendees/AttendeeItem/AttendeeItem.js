import React from "react";
import styles from "./attendee-item.module.css";

const EventItem = props => (
  <div key={props.userId} className={styles.itemWrapper}>
    <div className={styles.item}>{props.name}</div>
    <div className={styles.item}>{props.drinkCounter}</div>
  </div>
);

export default EventItem;
