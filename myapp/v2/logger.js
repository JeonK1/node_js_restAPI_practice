require('winston-daily-rotate-file');
require('dotenv').config();

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const transport = new transports.DailyRotateFile({
    filename: 'API-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    dirname: './logs',
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = createLogger({
    format: combine(
        label({label: "teacher_API"}),
        timestamp(),
        myFormat
    ),
    transports: [
        transport
    ]
})

if(process.env.FLAG_PRINT_LOG_CONSOLE === "true"){
    logger.add(new transports.Console());
}

module.exports = logger;