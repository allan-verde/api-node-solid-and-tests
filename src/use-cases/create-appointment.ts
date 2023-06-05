import { Appointment } from "../entities/appointment"
import { AppointmentRepository } from "../repositories/appointments-repository"

interface CreateAppointmentRequest {
    customer: string
    startsAt: Date
    endsAt: Date
}

type CreateAppointmentResponse = Appointment | Error

export class CreateAppointment {
    constructor(
        private appointmentsRepository: AppointmentRepository
    ) {}

    async execute(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
        const { customer, startsAt, endsAt } = request

        const overlappingAppointment = await this.appointmentsRepository.findOverlapping(startsAt, endsAt)

        if (overlappingAppointment) {
            throw new Error('The appointment overlaps with an existing appointment')
        }
    
        try {
            const appointment = new Appointment({
                customer,
                startsAt,
                endsAt,
            })

            await this.appointmentsRepository.create(appointment)

            return appointment
        } catch (error) {
            return error
        }
    }
}