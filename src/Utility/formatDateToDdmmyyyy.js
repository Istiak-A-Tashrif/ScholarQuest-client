export default function formatDateToDdmmyyyy(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }