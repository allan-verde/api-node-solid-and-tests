import { describe, expect, it } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../entities/appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository'

describe('create an appointment', () => {
    it('should be able to create an appointment', () => {
        const appointmentRepository = new InMemoryAppointmentsRepository()
        const createAppointment = new CreateAppointment(appointmentRepository)
        
        const startsAt = getFutureDate('2023-06-10')
        const endsAt = getFutureDate('2023-06-11')

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt,
        })).resolves.toBeInstanceOf(Appointment)
    })

    it('should not be able to create an appointment with overlapping dates', async () => {
        const appointmentRepository = new InMemoryAppointmentsRepository()
        const createAppointment = new CreateAppointment(appointmentRepository)
        
        const startsAt = getFutureDate('2023-06-10')
        const endsAt = getFutureDate('2023-06-15')

        await createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt,
        })

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2023-06-14'),
            endsAt: getFutureDate('2023-06-18'),
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2023-06-08'),
            endsAt: getFutureDate('2023-06-12'),
        })).rejects.toBeInstanceOf(Error)

        
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2023-06-08'),
            endsAt: getFutureDate('2023-06-17'),
        })).rejects.toBeInstanceOf(Error)
        
        
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2023-06-11'),
            endsAt: getFutureDate('2023-06-12'),
        })).rejects.toBeInstanceOf(Error)
    })
})
