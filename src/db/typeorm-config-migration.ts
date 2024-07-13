import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { Investment } from 'src/db/entities/investment.entity'
import { DataSource, DataSourceOptions } from 'typeorm'

config()

const configService = new ConfigService()
const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: +configService.get<string>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: ["src/db/entities/*.ts"],
    migrations: [__dirname + '/migrations/*.ts'],
}

export default new DataSource(dataSourceOptions)