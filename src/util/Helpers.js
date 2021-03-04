
export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}
  
export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}  

export function getRanks() {

  const ranks = [
    'Gold Stripe',
    'Gold Belt',
    'Green Stripe',
    'Green Belt',
    'Purple Stripe',
    'Purple Belt',
    'Brown Stripe',
    'Brown Belt',
    'Red Stripe',
    'Red Belt',
    '1st Degree',
    '1st of 2nd',
    '2nd Degree',
    '1st of 3rd',
    '2nd of 3rd',
    '3rd Degree',
    '1st of 4th',
    '2nd of 4th',
    '3rd of 4th',
    '4th Degree',
    '1st of 5th',
    '2nd of 5th',
    '3rd of 5th',
    '4th of 5th',
    '5th Degree'
  ];

  return ranks;
}  