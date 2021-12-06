export const setHoursToDate = (initDate: string, hours: string | number) => {
    console.log('ddd', initDate, hours)
    return new Date(new Date(initDate).setHours(Number(hours))).toISOString()
}
