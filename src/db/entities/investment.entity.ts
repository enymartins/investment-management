import { Column, Entity } from "typeorm"
import { RootEntity } from "./root.entity"


@Entity({ name: 'investment' })
export class Investment extends RootEntity {
    @Column()
    clientId: string

    @Column('decimal', { precision: 15, scale: 2 })
    originalAmount: number

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number

    @Column('timestamp', { nullable: true })
    withdrawalDate: Date | null

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    withdrawnAmount: number
}
