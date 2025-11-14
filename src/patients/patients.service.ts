import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { IsNull, Not, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class PatientsService {

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) { }

  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create(createPatientDto);

    try {
      return await this.patientRepository.save(patient);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException(`Email '${createPatientDto.email}' already exists.`);
      }
      throw error;
    }

  }

  findAll() {
    return this.patientRepository.find();
  }

  async findOne(id: string) {

    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID '${id}' not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.preload({
      id: id,
      ...updatePatientDto
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID '${id}' not found`);
    }

    try {
      return await this.patientRepository.save(patient);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException(`Email '${updatePatientDto.email}' already exists.`)
      }

      throw error;
    }
  }

  async remove(id: string) {
    const patient = await this.findOne(id);

    await this.patientRepository.softRemove(patient);

    try {
      await this.patientRepository.softRemove(patient);
      return {
        message: `Patient with ID '${id}' is not active anymore.`,
        patient,
      };
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23503') {
        throw new ConflictException(`No se puede eliminar el paciente. Aún tiene datos (ej. planes) asociados.`);
      }
      throw error;
    }
  }

  async restore(id: string) {
    const result = await this.patientRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID '${id}' not found or It's already active`);
    }

    return this.patientRepository.findOne({ where: { id } })
  }

  async findAllInactive() {
    return this.patientRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull())
      }
    })
  }
}
