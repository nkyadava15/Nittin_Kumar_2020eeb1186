import React from 'react';
import './Ticket.css';

function Ticket(props) {
  const { id, title, status } = props.ticket;
  const userName =props.userName;
  const userAvailability=props.userAvailability;
  const userInitials = userName
    ? userName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
    : '';

    return (
        <div className="ticket-card">
          <div className="ticket-top">
            <div className="ticket-id">{id}</div>
            <div className="ticket-profile-picture">
              {userInitials}
              <div
                className={`ticket-user-status ${userAvailability ? 'available' : 'not-available'}`}
              ></div>
            </div>
          </div>
          <div className="ticket-title">
          <label className="custom-checkbox"  style={{backgroundColor:status === 'Done'?"#1b1d8a": "white"}}>
            <input
              type="checkbox"
              disabled={true}// allow according to permission
              checked={status === 'Done'}
            />
            <span className="checkmark">&#10003;</span>
          </label>
            {title}
          </div>
        </div>
      );
}

export default Ticket;
