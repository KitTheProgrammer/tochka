export const setHoursToDate = (initDate: string, hours: string | number) => {
    const h = new Date(initDate).setHours(Number(hours))
    const m = new Date(h).setMinutes(0)
    const s = new Date(m).setSeconds(0)
    const ms = new Date(s).setMilliseconds(0)
    return new Date(ms).toISOString()
}
