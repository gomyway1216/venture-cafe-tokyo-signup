import React from "react";
import AttendeeItem from "./AttendeeItem/AttendeeItem";
import styles from "./attendee-list.module.css";

const AttendeeList = props => {
  const attendees = props.attendees.map(attendee => {
    return (
      <AttendeeItem
        key={attendee.userId}
        name={attendee.name}
        drinkCounter={attendee.drinkCounter}
      />
    );
  });

  return <ul className={styles.attendeeList}>{attendees}</ul>;
};

export default AttendeeList;
