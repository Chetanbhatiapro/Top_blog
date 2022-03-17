export const getFormatedDateTime = (date) => {
  if(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); 
  }
}