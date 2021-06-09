export default {
    methods: {
        formatDateTime(date) {
            return this.formatDate(date) + " " + this.formatTime(date)
        },
        formatDate(date) {
            date = this.getDate(date)
            if (!date) {
                return ""
            }

            const { day, month, year } = this.getDateValues(date)
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)
        },
        formatTime(date) {
            date = this.getDate(date)
            if (!date) {
                return ""
            }

            const { hour, minute, second } = this.getDateValues(date)
            return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second)
        },
        getDate(date) {
            try {
                return date ? new Date(date) : ""
            } catch (e) {
                return ""
            }
        },
        getDateValues(date) {
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const hour = date.getHours()
            const minute = date.getMinutes()
            const second = date.getSeconds()

            return { day, month, year, hour, minute, second }
        }
    }
}
