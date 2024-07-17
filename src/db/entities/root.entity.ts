import { Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index({
    unique: true,
  })
  public id!: string

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamp',
    name: 'updated_at',
    select: true,
  })
  @Index()
  public updatedAt!: Date
}
