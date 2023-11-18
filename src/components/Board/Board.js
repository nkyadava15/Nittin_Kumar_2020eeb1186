import React, { useEffect, useState } from 'react';
import './Board.css';
import { fetchData } from '../../Data/Api';
import Ticket from '../Ticket/Ticket';

function Board() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem('groupingOption')
  );
  const [sortingOption, setSortingOption] = useState(
    localStorage.getItem('sortingOption') || 'priority'
  );

  useEffect(() => {
    fetchData()
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

   // Function to handle changes in the grouping option
   const handleGroupingChange = (e) => {
    const selectedValue = e.target.value;
    setGroupingOption(selectedValue);
    localStorage.setItem('groupingOption', selectedValue); // Store in local storage
  };

  // Function to handle changes in the sorting option
  const handleSortingChange = (e) => {
    const selectedValue = e.target.value;
    setSortingOption(selectedValue);
    localStorage.setItem('sortingOption', selectedValue); // Store in local storage
  };

  // Function to group tickets by priority, user
  const groupTickets = () => {
    switch (groupingOption) {
      case 'user':
        return groupByUser();
      case 'priority':
        return groupByPriority();
      default:
        return tickets; // Default to no grouping
    }
  };

  // Function to sort tickets by priority or title
  const sortTickets = (groupedTickets) => {
    switch (sortingOption) {
      case 'priority':
        return sortByPriority(groupedTickets);
      case 'title':
        return sortByTitle(groupedTickets);
      default:
        return groupedTickets; // Default to no sorting
    }
  };

  // Group tickets by user
  const groupByUser = () => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const user=getUserById(ticket.userId);
      const userName = user? user.name : 'Unknown';
      if (!grouped[userName]) {
        grouped[userName] = [];
      }
      grouped[userName].push(ticket);
    });
    return grouped;
  };

  // Group tickets by priority
  const groupByPriority = () => {
    const grouped = {
      'Urgent': [],
      'High': [],
      'Medium': [],
      'Low': [],
      'No priority': []
    };
    tickets.forEach((ticket) => {
      switch (ticket.priority) {
        case 4:
          grouped['Urgent'].push(ticket);
          break;
        case 3:
          grouped['High'].push(ticket);
          break;
        case 2:
          grouped['Medium'].push(ticket);
          break;
        case 1:
          grouped['Low'].push(ticket);
          break;
        default:
          grouped['No priority'].push(ticket);
          break;
      }
    });
    return grouped;
  };

// Sort tickets by priority (descending)
const sortByPriority = (groupedTickets) => {
  const sortedGroups = {};
  Object.keys(groupedTickets)
    .sort((a, b) => {
      const priorityOrder = {
        'Urgent': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1,
        'No priority': 0
      };
      return priorityOrder[b] - priorityOrder[a];
    })
    .forEach((key) => {
      sortedGroups[key] = groupedTickets[key].sort((a, b) => b.priority - a.priority);
    });
  return sortedGroups;
};

// Sort tickets by title (ascending)
const sortByTitle = (groupedTickets) => {
  const sortedGroups = {};
  Object.keys(groupedTickets)
    .sort()
    .forEach((key) => {
      sortedGroups[key] = groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
    });
  return sortedGroups;
};


  // Function to get user name by user ID
  const getUserById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user;
  };

  const groupedAndSortedTickets = sortTickets(groupTickets());
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);

  const toggleDisplayOptions = () => {
    setDisplayOptionsVisible(!displayOptionsVisible);
  };
  const countTasksInGroup = (group) => {
    return groupedAndSortedTickets[group]?.length || 0;
  };

  return (
    <div className="board">
      <div className="display-options">
        <button onClick={toggleDisplayOptions} className="display-button">
        Display ▼
        </button>
        {displayOptionsVisible && (
          <div className="options">
            <div>
              <label>Grouping: </label>
              <select onChange={handleGroupingChange} value={groupingOption}>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div>
              <label>Ordering: </label>
              <select onChange={handleSortingChange} value={sortingOption}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="columns">
        {Object.entries(groupedAndSortedTickets).map(([groupLabel, group]) => (
          <div key={groupLabel} className="column">
            <div className='card'>
            <h3>
              {groupLabel} ({countTasksInGroup(groupLabel)})
            </h3>
            {group.map((ticket) => (
             <Ticket key={ticket.id} ticket={ticket} userName={getUserById(ticket.userId)? getUserById(ticket.userId).name : 'Unknown'} userAvailability={getUserById(ticket.userId)? getUserById(ticket.userId).available : false}/>
             
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
