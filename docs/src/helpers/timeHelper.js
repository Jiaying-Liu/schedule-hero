export const isDueWithinWeek = (dueDate, today) => {
    var oneDay = 24*60*60*1000;
    var diff = (dueDate.getTime() - today.getTime()) / oneDay;

    return diff > -1 && diff < 7 
}