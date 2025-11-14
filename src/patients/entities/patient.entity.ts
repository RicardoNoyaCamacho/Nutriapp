import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('patients')
export class Patient {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100, nullable: false })
    name: string;

    @Column('varchar', { length: 100, nullable: false })
    lastName: string;

    @Column('varchar', { length: 100, unique: true, nullable: false })
    email: string;

    @Column('date', { nullable: true })
    birthdayDate: Date;

    @Column('varchar', { length: 20, nullable: true })
    phone: string;

    //auto timestamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Soft Delete
    @DeleteDateColumn()
    deletedAt: Date;

}
